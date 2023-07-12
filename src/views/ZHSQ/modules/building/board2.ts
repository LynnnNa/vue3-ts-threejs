import * as THREE from 'three'

/***
 * 楼板类 延路径拉伸
 * @param {Array} curvePath 路径
 * @param {THREE.Material} materials 材质
 * @param {String} direction 延伸方向
 */
export default class Board {
	name = ''
	curvePath: THREE.CurvePath<THREE.Vector>
	extrudeSettings = {
		steps: 200,
		bevelEnabled: true,
		bevelThickness: 100,
		extrudePath: new THREE.CurvePath(),
	}
	deepness = 1
	height = 1
	materials:[THREE.Material]|undefined
	constructor(name = '', curvePath: THREE.CurvePath<THREE.Vector>, height=1, deepness = 1, materials?:[THREE.Material]) {
		this.name = name
		this.curvePath = curvePath
		this.extrudeSettings.extrudePath = curvePath
		this.deepness = deepness
		this.height = height
		this.materials = materials
		// return this.create
	}
	createShape() {
		const pts = [] as THREE.Vector2[]
		pts.push(new THREE.Vector2(0, -0.5 * this.deepness))
		pts.push(new THREE.Vector2(-this.height, -0.5 * this.deepness))
		pts.push(new THREE.Vector2(-this.height, 0.5 * this.deepness))
		pts.push(new THREE.Vector2(0, 0.5 * this.deepness))
		return pts
	}
	create() {
		// 生成挤压模型
		const pts = this.createShape()
		const shape = new THREE.Shape(pts)
		const geometry = new THREE.ExtrudeGeometry(shape, this.extrudeSettings)
		const Mesh = new THREE.Mesh(geometry, this.materials)
		Mesh.name = this.name
		return Mesh
	}
}
