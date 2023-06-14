import { setPotion, UVGenerator } from './common'
import * as THREE from 'three'
export default class Unit {
	constructor(center = new THREE.Vector3(0, 0, 0), unitType = 1) {
		this.c = center
		const u = this.createUnit(unitType)
		// console.log('createUnit', u)
		return u
	}
	/* 创建单元模型 */
	createUnit(unitType = 1) {
		let group = []
		switch (unitType) {
			case 1:
				// group = group.concat(this.floorslab())
				group = group.concat(this.balcony())
				// group = group.concat(this.corridor())
				group.forEach((mesh) => {
					const { x, y, z } = mesh.position
					setPotion(this.c, mesh, x, y, z)
				})
				break
		}
		return group
	}
	// 阳台
	balcony() {
		const path = [
			{ x: 60, y: 40 },
			{ x: 60, y: 0 },
			{ x: 100, y: 0 },
			{ x: 100, y: 40 },
			{ x: 60, y: 40 },
		]
		let texture = new THREE.TextureLoader().load('/texture/window1.png')
		// console.log(texture)
		// texture.wrapS = texture.wrapT = THREE.RepeatWrapping
		// texture.offset.set(0, 0.5)
		// texture.repeat.set(0.01, 0.01)
		const window = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide })
		const wall = new THREE.MeshPhongMaterial({ color: '#888' })
		const b = this.board(path, 1, [window, window])
		// assignUVs(b.geometry)
		// b.material = [window, wall]
		setPotion(this.c, b, 0, 1, 40)
		return [b]
	}
	// 楼道
	corridor() {
		let group = []
		// 空间
		const box = () => {
			const g = new THREE.BoxGeometry(60, 16, 40)
			let texture = new THREE.TextureLoader().load('/texture/window1.png')
			const window = new THREE.MeshPhongMaterial({ map: texture })
			const Mesh = new THREE.Mesh(g, window)
			setPotion(this.c, Mesh, 10, 8, 40)
			return Mesh
		}
		group = group.concat(box())
		return group
	}
	/***
	 * 楼板
	 * @param {Array} pathArr 路径
	 * @param {Number} height 延伸高度
	 * @param {THREE.Material} materials 材质
	 * @param {String} direction 延伸方向
	 */
	board(pathArr, height, materials, direction = 'Z') {
		const shape = []
		pathArr.forEach((p) => {
			shape.push(new THREE.Vector3(p.x, p.y))
		})
		const _shape = new THREE.Shape(shape)
		const extrudeSettings = {
			depth: height, // 拉伸部分的长度
			bevelEnabled: false, // 是否给这个形状加斜面
			bevelSegments: 2, // 斜角的层数
			steps: 1, // 用多少段来细分这段拉伸的距离
			bevelSize: 1, // 拉伸面与被拉伸的图形的距离关系。越大，拉伸的截面就越大
			bevelThickness: 1, //斜角的厚度，斜角的顶点到拉伸部分的垂直距离
			UVGenerator,
		}
		const geomery = new THREE.ExtrudeGeometry(_shape, extrudeSettings) // z轴拉伸
		console.log('geomery', geomery)
		const Mesh = new THREE.Mesh(geomery, materials)
		if (direction === 'Y') {
			Mesh.rotateX(Math.PI / 2).position.setY(height)
		}
		return Mesh
	}
	// 地板
	floorslab() {
		const floorPath = [
			{ x: 0, y: 1 },
			{ x: 19, y: 1 },
			{ x: 19, y: 21 },
			{ x: 59, y: 21 },
			{ x: 59, y: 41 },
			{ x: 101, y: 41 },
			{ x: 101, y: -41 },
			{ x: 0, y: -41 },
			{ x: 0, y: 1 },
		]
		const Meter1 = new THREE.MeshLambertMaterial({ color: '#888' })
		// let window = new THREE.TextureLoader().load('/texture/window1.png')
		const f = this.board(floorPath, 1, Meter1, 'Y')
		return [f]
	}
}
