import * as THREE from 'three'

/***
 * 楼板类
 * @param {Array} pathArr 路径
 * @param {Number} height 延伸高度
 * @param {THREE.Material} materials 材质
 * @param {String} direction 延伸方向
 */
export default class Board {
	constructor(name = '', pathArr = [], height = 1, direction = 'Z',materials) {
		this.name = name
		this.pathArr = pathArr
		this.height = height
		this.direction = direction
		this.materials = materials
		// return this.create
	}
	addHole(hole) {
		this.shape.holes.push(hole)
		return this
	}
	createShape() {
		const paths = []
		this.pathArr.forEach((p) => {
			paths.push(new THREE.Vector3(p.x, p.y))
		})
		this.shape = new THREE.Shape(paths)
		return this
	}
	create() {
		const extrudeSettings = {
			depth: this.height, // 拉伸部分的长度
			bevelEnabled: false, // 是否给这个形状加斜面
			bevelSegments: 2, // 斜角的层数
			steps: 1, // 用多少段来细分这段拉伸的距离
			bevelSize: 1, // 拉伸面与被拉伸的图形的距离关系。越大，拉伸的截面就越大
			bevelThickness: 1, //斜角的厚度，斜角的顶点到拉伸部分的垂直距离
			UVGenerator: this.UVGenerator,
			shapeVertices: this.pathArr,
		}
		const geomery = new THREE.ExtrudeGeometry(this.shape, extrudeSettings) // z轴拉伸
		geomery.name = this.name
		// console.log('geomery', geomery)
		const Mesh = new THREE.Mesh(geomery, this.materials)
		Mesh.name = this.name
		if (this.direction === 'Y') {
			Mesh.rotateX(Math.PI / 2).position.setY(this.height)
		}
		Mesh.userData.direction = this.direction
		Mesh.userData.height = this.height
		return Mesh
	}
	// uvArray = []
	UVGenerator = {
		faces: [],
		faceIndex: 0,
		generateTopUV: function (geometry, vertices, indexA, indexB, indexC) {
			const a_x = vertices[indexA * 3]
			const a_y = vertices[indexA * 3 + 1]
			const b_x = vertices[indexB * 3]
			const b_y = vertices[indexB * 3 + 1]
			const c_x = vertices[indexC * 3]
			const c_y = vertices[indexC * 3 + 1]
			return [new THREE.Vector2(a_x, a_y), new THREE.Vector2(b_x, b_y), new THREE.Vector2(c_x, c_y)]
		},
		/**
		 * 调用顺序为 某个面沿路径延申 -> 另一个面沿路径延申，faceIndex
		 * 四个顶点中，abd 是第一个三角形，bcd 是第二个三角形 ** vertices每次添加1一个面=2个三角=6个点=18个坐标
		 * uStep 沿u方向的 第几段
		 * faceIndex 那个截面
		 */
		generateSideWallUV: function (geometry, vertices, indexA, indexB, indexC, indexD, uStep = 0) {
			// u值分段
			const totalStep = geometry.parameters.options.steps
			// 四个点 确定一个断面，两个三角形 abd / bcd
			const stepX = uStep / (totalStep + 1)
			const u_min = stepX / totalStep
			const u_max = u_min + 1 / totalStep
			// const path = geometry.shapeVertices
			const path = geometry.parameters.options.shapeVertices
			// const path = geometry.parameters.shapes.holes[0].curves
			let perimeter = 0 // 路径周长
			let tempL = 0
			path.forEach((v, i) => {
				if (i > path.length) return
				let next = path[i + 1]
				if (i === path.length - 1) next = path[0]
				const { x: xc, y: yc } = v
				const { x: xn, y: yn } = next
				const x = Math.abs(xn - xc)
				const y = Math.abs(yn - yc)
				const l = Math.sqrt(x * x + y * y)
				path[i].l = l
				perimeter += l
			})
			this.uvArray = path.map((v) => {
				const min = tempL
				const u = v.l / perimeter
				tempL += u
				return [min, tempL]
			})
			//参照源码遍历面的顺序, 填充 this.faces
			if (!this.faces.length) {
				let pathLength = path.length - 1
				while (--pathLength >= 0) {
					let k = pathLength - 1
					if (k < 0) k = path.length - 1 - 1
					this.faces.push(k)
				}
				// console.log(this.faces)
			}
			if (this.faceIndex === this.faces.length) {
				this.faceIndex = 0
			}
			const faceindex = this.faces[this.faceIndex]
			this.faceIndex++
			const v_min = this.uvArray[faceindex][0]
			const v_max = this.uvArray[faceindex][1]
			const uvs = [
				// 整个侧面完整uv
				new THREE.Vector2(v_max, u_max), // 左下
				new THREE.Vector2(v_min, u_max), // 右下
				new THREE.Vector2(v_min, u_min), // 右上
				new THREE.Vector2(v_max, u_min), // 左上
			]
			return uvs
		},
	}
}
