import { setPotion } from './common'
import * as THREE from 'three'
export default class Unit {
	constructor(center = new THREE.Vector3(0, 0, 0), unitType = 1) {
		this.c = center
		const u = this.createUnit(unitType)
		console.log('createUnit', u)
		return u
	}
	/* 创建单元模型 */
	createUnit(unitType = 1) {
		let group = []
		switch (unitType) {
			case 1:
				// group = group.concat(this.balcony()).concat(this.bedRoom()).concat(this.corridor())
				group = group.concat(this.bedRoom()) // .concat(this.floorslab())
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
		let group = []
		// 楼板
		const floorslab = () => {
			const g = new THREE.BoxGeometry(82, 1, 42)
			const m = new THREE.MeshLambertMaterial({ color: 0x777777 })
			const Mesh = new THREE.Mesh(g, m)
			setPotion(this.c, Mesh, 0, 0, 0)
			return Mesh
		}
		// 空间
		const box = () => {
			const g = new THREE.BoxGeometry(80, 16, 40)
			const m = new THREE.MeshLambertMaterial({ color: 0x777777 })
			const Mesh = new THREE.Mesh(g, m)
			setPotion(this.c, Mesh, 0, 8, 0)
			return Mesh
		}
		group = group.concat(floorslab()).concat(box())
		return group
	}
	// 楼道
	corridor() {
		let group = []
		// 楼板
		const floorslab = () => {
			const g = new THREE.BoxGeometry(62, 1, 42)
			const m = new THREE.MeshLambertMaterial({ color: 0x777777 })
			const Mesh = new THREE.Mesh(g, m)
			setPotion(this.c, Mesh, 10, 0, 40)
			return Mesh
		}
		// 空间
		const box = () => {
			const g = new THREE.BoxGeometry(60, 16, 40)
			const m = new THREE.MeshLambertMaterial({ color: 0x777777 })
			const Mesh = new THREE.Mesh(g, m)
			setPotion(this.c, Mesh, 10, 8, 40)
			return Mesh
		}
		group = group.concat(floorslab()).concat(box())
		return group
	}
	// 户
	room(pathArr, height, materials) {
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
		}
		const geomery = new THREE.ExtrudeGeometry(_shape, extrudeSettings) // z轴拉伸
		const Mesh = new THREE.Mesh(geomery, materials)
		Mesh.rotateX(Math.PI / 2).position.setY(height)
		return Mesh
	}
	// 卧室
	bedRoom() {
		const roomPath = [
			{ x: 0, y: 0 },
			{ x: 20, y: 0 },
			{ x: 20, y: 20 },
			{ x: 60, y: 20 },
			{ x: 60, y: 40 },
			{ x: 100, y: 40 },
			{ x: 100, y: -40 },
			{ x: 0, y: -40 },
			{ x: 0, y: 0 },
		]
		const Meter1 = new THREE.MeshLambertMaterial({ color: 0xf50000 }) // 红 上下
		let window = new THREE.TextureLoader().load('/texture/window1.png')
		const material = new THREE.MeshPhongMaterial({ map: window })
		window.colorSpace = THREE.SRGBColorSpace
		const materials = [Meter1, material]
		const r = this.room(roomPath, 40, materials)
		return [r]
	}
	// 楼板
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
		const Meter1 = new THREE.MeshLambertMaterial({ color: 0x777777 }) // 面
		let window = new THREE.TextureLoader().load('/texture/window1.png')
		const f = this.room(floorPath, 1)
		return [f]
	}
}
