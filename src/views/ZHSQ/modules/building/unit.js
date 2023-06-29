import { setPotion, createGroup, mirrorCoords } from './common'
import Board from './board'
import * as THREE from 'three'

const color_wall = '#d4d4d4'
const color_floorslab = '#f8a23f'
export const uWidth = 200
export const uHeight = 40
export const uDept = 80
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
const roofLong = 4 // 房盖延伸长度
const roofPath = [
	{ x: -60 - roofLong, y: 20 + roofLong },
	{ x: 60 - roofLong, y: 20 + roofLong },
	{ x: 60 - roofLong, y: 40 + roofLong },
	{ x: 100 + roofLong, y: 40 + roofLong },
	{ x: 100 + roofLong, y: -40 - roofLong },
	{ x: -100 - roofLong, y: -40 - roofLong },
	{ x: -100 - roofLong, y: 40 + roofLong },
	{ x: -60 + roofLong, y: 40 + roofLong },
	{ x: -60 + roofLong, y: -20 - roofLong },
	{ x: -60 - roofLong, y: 20 + roofLong },
]
export default class Unit {
	constructor(name = '', currentFloor = 0, center = new THREE.Vector3(0, 0, 0), unitType = 1) {
		this.uName = name
		this.currentFloor = currentFloor
		this.c = center
		this.unitType = unitType
		this.hasRoof = false
		return this
	}
	// addUserData(){

	// }
	/* 创建单元模型 */
	createUnit(unitType = 1) {
		let group = []
		switch (unitType) {
			case 1: {
				const roomR = createGroup([].concat(this.room()).concat(this.floorslab())) // 右侧住户
				roomR.name = `roomR`
				roomR.userData.name = `${this.uName}${this.currentFloor + 1}01`
				const roomL = createGroup([].concat(this.room(true)).concat(this.floorslab(true))) // 左侧住户
				roomL.userData.name = `${this.uName}${this.currentFloor + 1}02`
				roomL.name = `roomL`
				const corridor = createGroup([].concat(this.floorsCorridor()).concat(this.corridorWindow()).concat(this.corridorBalcony())) // 楼道
				corridor.userData.name = `${this.uName}${this.currentFloor}层楼道`
				corridor.name = `corridor`
				// this.roomL = roomL
				group = group.concat(roomL)
				group = group.concat(roomR)
				group = group.concat(corridor)
				if (this.hasRoof) {
					const roof = createGroup([].concat(this.roof())) // 房盖
					group = group.concat(roof)
				}
				break
			}
		}
		group = createGroup(group)
		group.name = this.uName
		const { x, y, z } = group.position
		setPotion(this.c, group, x, y, z)
		return group
	}
	/* 住户 */
	room(isMirror = false) {
		let path = roomPath
		if (isMirror) path = mirrorCoords(path)
		const _b = new Board('room', path, 39, 'Y', isMirror)
		const tb = new THREE.MeshLambertMaterial({ color: color_wall })
		const wload = new THREE.TextureLoader().load('/texture/uvwins.png')
		// wload.wrapS = THREE.RepeatWrapping
		// wload.wrapT = THREE.RepeatWrapping
		// wload.repeat.set(1, 1)
		const windows = new THREE.MeshLambertMaterial({ map: wload, side: THREE.DoubleSide })
		// this.texture = wload
		// this.material = windows
		_b.materials = [tb, windows]
		let hpath = [
			{ x: 1, y: -1 },
			{ x: 21, y: -1 },
			{ x: 21, y: 19 },
			{ x: 61, y: 19 },
			{ x: 61, y: 39 },
			{ x: 99, y: 39 },
			{ x: 99, y: -39 },
			{ x: 1, y: -39 },
			{ x: 1, y: -1 },
		]
		if (isMirror) hpath = mirrorCoords(hpath)
		const hole = new THREE.Path(hpath)
		const obj = _b.createShape().addHole(hole).create()
		const { x, y, z } = obj.position
		setPotion(new THREE.Vector3(), obj, x, y + 1, z)
		return [obj]
	}
	// 住户地板
	floorslab(isMirror = false) {
		let path = [
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
		if (isMirror) path = mirrorCoords(path)
		const Meter1 = new THREE.MeshLambertMaterial({ color: color_floorslab })
		const b = new Board('floorslab', path, 1, 'Y', isMirror)
		b.materials = Meter1
		const f = b.createShape().create()
		return [f]
	}
	// 楼道
	corridorWindow() {
		let group = []
		// 空间
		const box = () => {
			const g = new THREE.BoxGeometry(40, 39, 1)
			let img = '/texture/lang.png'
			if (this.currentFloor === 0) img = '/texture/unitD.jpeg'
			let texture = new THREE.TextureLoader().load(img)
			const window = new THREE.MeshPhongMaterial({ map: texture })
			const wall = new THREE.MeshLambertMaterial({ color: color_wall }) // 灰
			const wallFloor = new THREE.MeshLambertMaterial({ color: color_floorslab }) // 橙
			const Mesh = new THREE.Mesh(g, [wallFloor, wallFloor, wall, wallFloor, window, window]) // 右左 上
			setPotion(new THREE.Vector3(), Mesh, 0, 20.5, 19.5)
			return Mesh
		}
		group = group.concat(box())
		return group
	}
	// 楼道阳台
	corridorBalcony() {
		let long = 1
		let thickness = 1
		if (this.currentFloor === 1) {
			long = 13
			thickness = 2
		}
		let path = [
			{ x: 0, y: 20 },
			{ x: -20, y: 20 },
			{ x: -20, y: 20 + long },
			{ x: 20, y: 20 + long },
			{ x: 20, y: 20 },
			{ x: 0, y: 20 },
		]
		const Meter1 = new THREE.MeshLambertMaterial({ color: color_floorslab })
		const b = new Board('floorslab', path, thickness, 'Y')
		b.materials = Meter1
		const f = b.createShape().create()
		return [f]
	}
	// 楼道地板
	floorsCorridor() {
		let path = [
			{ x: 0, y: 1 },
			{ x: -19, y: 1 },
			{ x: -19, y: 9 },
			{ x: 19, y: 9 },
			{ x: 19, y: 1 },
			{ x: 0, y: 1 },
		]
		// if (isMirror) path = mirrorCoords(path)
		const Meter1 = new THREE.MeshLambertMaterial({ color: color_floorslab })
		const b = new Board('floorslab', path, 1, 'Y')
		b.materials = Meter1
		const f = b.createShape().create()
		return [f]
	}
	/* 单元房盖 */
	roof() {
		const path = roofPath
		const Meter1 = new THREE.MeshLambertMaterial({ color: color_floorslab })
		const b = new Board('floorslab', path, 3, 'Y')
		b.materials = Meter1
		const f = b.createShape().create()
		setPotion(new THREE.Vector3(), f, 0, 41, 0)
		return [f]
	}
	//更新纹理贴图的方法
	updateUV(e) {
		// 一种方法，直接全写在一个方法内
		//texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );

		// 另一种方法，分开写
		// console.log(this)
		// this.material.map.matrix
		// 	.identity() //矩阵重置
		// 	.translate(-this.gui.centerX, -this.gui.centerY) //设置中心点
		// 	.rotate(this.gui.rotation) // 旋转
		// 	.scale(this.gui.repeatX, this.gui.repeatY) //缩放
		// 	.translate(this.gui.centerX, this.gui.centerY) //设置中心点
		// 	.translate(this.gui.offsetX, this.gui.offsetY) //偏移
		// this.material.map.needsUpdate = true
		this.texture.repeat.set(this.gui.repeatX, this.gui.repeatY)
	}
}