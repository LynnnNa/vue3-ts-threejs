import * as THREE from 'three'

/***
 * 楼板类
 * @param {Array} pathArr 路径
 * @param {Number} height 延伸高度
 * @param {THREE.Material} materials 材质
 * @param {String} direction 延伸方向
 */
export default class Board {
	constructor(name = '', pathArr = [], height = 1, direction = 'Z') {
		this.name = name
		this.pathArr = pathArr
		this.height = height
		this.direction = direction
		this.materials
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
	uvArray = []
	UVGenerator = {
		generateTopUV: function (geometry, vertices, indexA, indexB, indexC, lidType, faceIndex) {
			// 底面/顶面 的 shapeBox，用于计算每个截面的 v 值
			const { lidBox } = geometry
			const size = new THREE.Vector2()
			// 获取盖面的包围盒大小，进行比较
			lidBox.getSize(size)
			const face = geometry.shapeFaces[faceIndex]
			let p_a, p_b, p_c
			if (lidType === 'top') {
				// 顶盖面
				// 原始face顶点顺序为 0-1-2
				p_a = geometry.shapeVertices[face[0]]
				p_b = geometry.shapeVertices[face[1]]
				p_c = geometry.shapeVertices[face[2]]
			}
			if (lidType === 'bottom') {
				// 底盖面
				// 原始face顶点顺序为 2-1-0
				p_a = geometry.shapeVertices[face[2]]
				p_b = geometry.shapeVertices[face[1]]
				p_c = geometry.shapeVertices[face[0]]
			}
			let uv_a
			let uv_b
			let uv_c
			try {
				uv_a = new THREE.Vector2((p_a.x - lidBox.min.x) / size.x, (p_a.y - lidBox.min.y) / size.y)
				uv_b = new THREE.Vector2((p_b.x - lidBox.min.x) / size.x, (p_b.y - lidBox.min.y) / size.y)
				uv_c = new THREE.Vector2((p_c.x - lidBox.min.x) / size.x, (p_c.y - lidBox.min.y) / size.y)
			} catch (e) {
				uv_a = 0
				uv_b = 1
				uv_c = -1
			}
			return [uv_a, uv_b, uv_c]
		},
		/**
		 * 调用顺序为 某个面沿路径延申 -> 另一个面沿路径延申，faceIndex
		 * 四个顶点中，abd 是第一个三角形，bcd 是第二个三角形
		 * uStep 沿u方向的 第几段
		 * faceIndex 那个截面
		 */
		generateSideWallUV: function (geometry, vertices, indexA, indexB, indexC, indexD, uStep, faceIndex) {
			// u值分段
			const totalStep = geometry.parameters.options.steps
			// 四个点 确定一个断面，两个三角形 abd / bcd
			const stepX = uStep / (totalStep + 1)
			const u_min = stepX / totalStep
			const u_max = u_min + 1 / totalStep

			// abd三角形中，ab共享u: u_min，ad共享v: v_min
			// bcd三角形中，cd共享u: u_max，bc共享v: v_max

			// v值分段，使用原始的2dShape，与每个点占整个曲线的比例计算v值

			// const v_min = faceIndex / (totalStep + 1) / 4 // totalStep + 1 一个面分成几个三角
			// const v_max = v_min + 1 / (totalStep + 1) / 4
			const vlen = vertices.length
			// console.log(faceIndex, vlen, ':', vertices[vlen - 6], vertices[vlen - 5], vertices[vlen - 3], vertices[vlen - 2])
			const path = geometry.shapeVertices
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
			// console.log(path, this.uvArray)
			// const xc = vertices[vlen - 6]
			// const yc = vertices[vlen - 5]
			// const xn = vertices[vlen - 3]
			// const yn = vertices[vlen - 2]
			// const x = Math.abs(xn - xc)
			// const y = Math.abs(yn - yc)
			// const wallLength = Math.sqrt(x * x + y * y)
			// console.log(perimeter, wallLength)
			// const uvLength = wallLength / perimeter // 当前面长度/周长 = Uv长度
			const v_min = this.uvArray[faceIndex][0]
			const v_max = this.uvArray[faceIndex][1]
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
