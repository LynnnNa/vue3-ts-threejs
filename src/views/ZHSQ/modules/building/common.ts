import * as THREE from 'three'
export function setPotion(c = new THREE.Vector3(), target, x = 0, y = 0, z = 0) {
	target.position.set(c.x + x, c.y + y, c.z + z)
}
export const UVGenerator = {
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

		const v_min = faceIndex / (totalStep + 1) / 4 // totalStep + 1 一个面分成几个三角
		const v_max = v_min + 1 / (totalStep + 1) / 4
		const uvs = [
			// 每个侧面独立u/v
			// new THREE.Vector2(u_min, 0),
			// new THREE.Vector2(u_min, 1),
			// new THREE.Vector2(u_max, 1),
			// new THREE.Vector2(u_max, 0),

			// 整个侧面完整uv
			new THREE.Vector2(v_max, u_max), // 左下
			new THREE.Vector2(v_min, u_max), // 右下
			new THREE.Vector2(v_min, u_min), // 右上
			new THREE.Vector2(v_max, u_min), // 左上
		]
		const vlen = vertices.length
		let str = '' + vertices.length
		/* for (let j = 18; j >= 1; j--) {
			if (j % 3 === 0) str += '('
			str += ' ' + vertices[vertices.length - j]
			if (j % 3 === 1) str += ')'
		} */
		// console.log(faceIndex, ':', str)
		// console.log(faceIndex, ':', vertices[vlen - 6], vertices[vlen - 5], vertices[vlen - 3], vertices[vlen - 2])
		return uvs
	},
}
export const createGroup = (layers) => {
	const group = new THREE.Group()
	layers.forEach((node) => {
		group.add(node)
	})
	return group
}
export const clone = (t) => {
	if (t.clone) return t.clone()
	const _t = t.map((Mesh) => {
		return Mesh.clone()
	})
	return _t
}
export const mirrorCoord = (c: THREE.Vector3 & { x: number }, direction = 'X') => {
	const { x } = c
	let res = c.clone ? c.clone() : c
	if (direction === 'X') {
		res.x = -x
	}
	return res
}
export const mirrorCoords = (Array, direction = 'X') => {
	const res = Array.map((c) => {
		return mirrorCoord(c, direction)
	})
	return res.reverse()
}
export const remove = (obj, scence) => {
	// console.log(obj)
	if (!obj) return
	if (!obj.isObject3D) return
	// console.log('remove', obj)
	//typeof obj
	obj.children?.forEach((o) => {
		if (o.isObject3D) {
			scence.remove(o)
			obj.clear()
		}
	})
	scence.remove(obj)
	obj.clear()
}
export const createOutline = (mesh, color = '#36BCFF', opacity = 0.4) => {
	const position = mesh.getWorldPosition(new THREE.Vector3())
	const lineGroup = new THREE.Group()
	const lineMeterial = new THREE.LineBasicMaterial({
		color,
		transparent: true,
		opacity,
		depthWrite: false,
		side: THREE.DoubleSide,
	})
	const edges = new THREE.EdgesGeometry(mesh.geometry)
	const lineS = new THREE.LineSegments(edges, lineMeterial)
	lineGroup.add(lineS)
	const { x, y, z } = position
	lineGroup.position.set(x, y, z)
	const { direction } = mesh.userData
	if (direction === 'Y') {
		lineGroup.rotateX(Math.PI / 2)
	}
	return lineGroup
}
/**
 *
 * @param {Array<THREE.Vector2>} pathArr path数组
 * @param {number} length 拓展长度
 * @param {number} type 拓展类型 1 外扩, 2收缩
 * @param {THREE.Vector2} c 参照中心点, ***主义取点方法: 所有定点与该原点连线, 不可穿过path
 * @return {Array<THREE.Vector2>}
 */
export const expandPath = (pathArr: Array<THREE.Vector2> = [], c = new THREE.Vector2(), type = 1, length = 1): Array<THREE.Vector2> => {
	const { x: cx, y: cy } = c
	// const l = pathArr.length
	const path = pathArr.map((coord) => {
		// const prev = i === 0 ? pathArr[l - 1] : pathArr[i - 1]
		// const next = i === l - 1 ? pathArr[0] : pathArr[i + 1]
		const { x, y } = coord
		let pmX = (x - cx) / Math.abs(x - cx)
		let pmY = (y - cy) / Math.abs(y - cy)
		if (type === 1) {
			pmX = -pmX
			pmY = -pmY
		}
		const newX = pmX ? x - pmX * length : 0
		const newY = pmY ? y - pmY * length : 0
		return new THREE.Vector2(newX, newY)
	})
	return path
}
export default {}
