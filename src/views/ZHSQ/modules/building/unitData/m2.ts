import { expandPath, setPotion, createGroup, mirrorCoord, mirrorCoords } from '/@/views/ZHSQ/modules/building/common'
import Board from '/@/views/ZHSQ/modules/building/board'
import Board2 from '/@/views/ZHSQ/modules/building/board2'
import * as THREE from 'three'
import { m_glass, m_glass_2, color_floorslab, color_wall, m_fff } from '/@/views/ZHSQ/modules/building/m'

export default class unitModule {
	uWidth = 228 // 单元宽度
	uHeight = 40 // 单元高度
	uDept = 132 // 单元深度
	corridorDept = 15 // 楼道阳台深度
	// 房间path
	roomPath = [
		new THREE.Vector2(12, 0),
		new THREE.Vector2(12, 66),
		new THREE.Vector2(100, 66),
		new THREE.Vector2(100, 12),
		new THREE.Vector2(114, 12),
		new THREE.Vector2(114, -50),
		new THREE.Vector2(34, -50),
		new THREE.Vector2(34, -66),
		new THREE.Vector2(0, -66),
		new THREE.Vector2(0, -12),
		new THREE.Vector2(12, -12),
		new THREE.Vector2(12, 0),
	]
	roomHolePath = expandPath(this.roomPath, new THREE.Vector2(30, -30), 2, 2)
	floorslabPath = expandPath(this.roomPath, new THREE.Vector2(30, -30), 1, 1)
	roofLong = 3 // 房盖延伸长度

	uName = ''
	currentFloor = 0
	c = new THREE.Vector3(0, 0, 0)
	isTop = true
	constructor(name = '', currentFloor = 0, center = new THREE.Vector3(0, 0, 0), isTop = false) {
		this.uName = name
		this.currentFloor = currentFloor
		this.isTop = isTop
		this.c = center
	}
	/* 创建单元模型 */
	createUnit() {
		let group = new Array()
		const roomR = createGroup(([] as any[]).concat(this.room()).concat(this.floorslab())) // 右侧住户
		roomR.name = `roomR`
		roomR.userData.name = `${this.uName}${this.currentFloor + 1}01`
		const roomL = createGroup(([] as any[]).concat(this.room(true)).concat(this.floorslab(true))) // 左侧住户
		roomL.userData.name = `${this.uName}${this.currentFloor + 1}02`
		roomL.name = `roomL`
		const corridor = createGroup(
			([] as any[]).concat(this.floorsCorridor()).concat(this.elevatorShaft()).concat(this.corridorWindow()).concat(this.corridorBalcony())
		) // 楼道
		corridor.userData.name = `${this.uName}${this.currentFloor}层楼道`
		corridor.name = `corridors`
		group = group.concat(roomL)
		group = group.concat(roomR)
		group = group.concat(corridor)
		if (this.isTop) {
			const roof = createGroup(([] as any[]).concat(this.roof(2, this.roofLong))) // 房盖
			group = group.concat(roof)
		}
		if(this.currentFloor === 1){
			/* 单元阁楼围墙 */
			for (let i = 3; i > 0; i--) {
				const t = this.roofRoomBoard(2, 3 + 1 - i, -this.uHeight / 2 + 2 * (3 - i))
				group = group.concat([t])
			}
			/* 房间房盖 阁楼 */
			for (let i = 3; i > 0; i--) {
				const t = this.roofBoard(2, 3 + 1 - i, -this.uHeight + 2 * (3 - i))
				group = group.concat([t])
			}
		}
		const d3group = createGroup(group)
		d3group.name = this.uName
		const { x, y, z } = d3group.position
		setPotion(this.c, d3group, x, y, z)
		return d3group
	}
	/* 住户 */
	room(isMirror = false) {
		let path = this.roomPath
		if (isMirror) path = mirrorCoords(path)
		const _b = new Board('room', path, this.uHeight - 1, 'Y', isMirror)
		const tb = new THREE.MeshLambertMaterial({ color: color_wall })
		const wload = new THREE.TextureLoader().load('/texture/uvwins.png')
		// wload.wrapS = THREE.RepeatWrapping
		// wload.wrapT = THREE.RepeatWrapping
		// wload.repeat.set(1, 1)
		const windows = new THREE.MeshLambertMaterial({ map: wload, side: THREE.DoubleSide })
		// this.texture = wload
		// this.material = windows
		_b.materials = [tb, windows]
		let hpath = this.roomHolePath
		if (isMirror) hpath = mirrorCoords(hpath)
		const hole = new THREE.Path(hpath)
		const obj = _b.createShape().addHole(hole).create()
		const { x, y, z } = obj.position
		setPotion(new THREE.Vector3(), obj, x, y + 1, z)
		return [obj]
	}
	// 住户地板
	floorslab(isMirror = false) {
		let path = this.floorslabPath
		if (isMirror) path = mirrorCoords(path)
		const Meter1 = new THREE.MeshLambertMaterial({ color: color_floorslab })
		const b = new Board('floorslab', path, 1, 'Y', isMirror)
		b.materials = Meter1
		const f = b.createShape().create()
		return [f]
	}
	// 楼道窗户
	corridorWindow() {
		const tb = new THREE.MeshLambertMaterial({ color: color_wall })
		let group = [] as any[]
		// 空间
		const box = () => {
			const curvePath = new THREE.CurvePath()
			const line1 = new THREE.LineCurve3(new THREE.Vector3(20, 0, 0), new THREE.Vector3(20, 0, 15))
			const line2 = new THREE.LineCurve3(new THREE.Vector3(20, 0, 15), new THREE.Vector3(-20, 0, 15))
			const line3 = new THREE.LineCurve3(mirrorCoord(line1.v2), mirrorCoord(line1.v1))
			curvePath.add(line1)
			curvePath.add(line2)
			curvePath.add(line3)
			const b = new Board2('corridorWindow', curvePath, this.uHeight, 1, [tb])
			const Mesh = b.create()
			setPotion(new THREE.Vector3(), Mesh, 0, 0, this.uDept / 2)
			return Mesh
		}
		group = group.concat(box())
		return group
	}
	// 楼道阳台地板
	corridorBalcony() {
		let dept = this.corridorDept
		if (this.currentFloor === 1) {
			dept = this.corridorDept + 10
		}
		let group = [] as any[]
		// 空间
		const box = () => {
			const g = new THREE.BoxGeometry(40, 1, dept)
			// const wall = new THREE.MeshLambertMaterial({ color: color_floorslab }) // 灰
			const Mesh = new THREE.Mesh(g, m_fff) // 右左 上
			setPotion(new THREE.Vector3(), Mesh, 0, 0, this.uDept / 2 + dept / 2)
			Mesh.name = 'elevatorShaft'
			return Mesh
		}
		group = group.concat(box())
		return group
	}
	// 楼道地板
	floorsCorridor() {
		let path = [
			{ x: 0, y: 12 },
			{ x: -11, y: 12 },
			{ x: -11, y: 36 },
			{ x: 11, y: 36 },
			{ x: 11, y: 12 },
			{ x: 0, y: 12 },
		]
		// if (isMirror) path = mirrorCoords(path)
		const Meter1 = new THREE.MeshLambertMaterial({ color: color_floorslab })
		const b = new Board('floorslab', path, 1, 'Y')
		b.materials = Meter1
		const f = b.createShape().create()
		return [f]
	}
	// 电梯井
	elevatorShaft() {
		let group = [] as any[]
		// 空间
		const box = () => {
			const g = new THREE.BoxGeometry(24, this.uHeight - 1, 1)
			const wall = new THREE.MeshLambertMaterial({ color: color_wall }) // 灰
			const Mesh = new THREE.Mesh(g, wall) // 右左 上
			setPotion(new THREE.Vector3(), Mesh, 0, (this.uHeight + 1) / 2, 12)
			Mesh.name = 'elevatorShaft'
			return Mesh
		}
		group = group.concat(box())
		return group
	}
	/* 单元房盖 */
	roof(height = 2, expand = 3) {
		let rf = [] as any[]
		/* 房间房盖 */
		for (let i = expand; i > 0; i--) {
			const t = this.roofBoard(height, expand + 1 - i, height * (expand - i))
			rf.push(t)
		}
		for (let i = 0; i < expand; i++) {
			const t = this.roofBoard(height, -i - 1, height * (expand + i))
			rf.push(t)
		}
		/* 单元房盖 */
		for (let i = expand; i > 0; i--) {
			const t = this.roofRoomBoard(height, expand + 1 - i, this.uHeight + height * (expand - i))
			rf.push(t)
		}
		for (let i = 0; i < expand; i++) {
			const t = this.roofRoomBoard(height, -i - 1, this.uHeight + height * (expand + i))
			rf.push(t)
		}
		if (this.currentFloor > 1) {
			/* 单元阁楼围墙 */
			for (let i = expand; i > 0; i--) {
				const t = this.roofRoomBoard(height, expand + 1 - i, -this.uHeight / 2 + height * (expand - i))
				rf.push(t)
			}
			/* 房间阁楼围墙 */
			for (let i = expand; i > 0; i--) {
				const t = this.roofBoard(height, expand + 1 - i, -this.uHeight + height * (expand - i))
				rf.push(t)
			}
		}
		const roorRoom = this.roofRoom()
		rf = rf.concat(roorRoom)
		return rf
	}
	roofBoard(height = 2, expand = 3, y = 0) {
		// 房盖path
		const tempPath = this.roomPath.slice(2, this.roomPath.length - 3)
		let temp1 = expandPath(tempPath, new THREE.Vector2(30, -30), 1, expand)
		// temp1 = this.roomPath.slice(1, 2).concat(temp1)
		let temp2 = expandPath(mirrorCoords(tempPath), new THREE.Vector2(-30, -30), 1, expand)
		// temp2 =temp2.concat(mirrorCoords(this.roomPath.slice(1, 2)))
		const path = ([] as any[])
			.concat([new THREE.Vector2(12 + 2, -12 - 2)])
			.concat([new THREE.Vector2(12 + 2, 66 - 2)])
			.concat([new THREE.Vector2(12 + 9, 66 - 2)])
			.concat([new THREE.Vector2(12 + 9, 66 + expand)])
			.concat(temp1)
			.concat(temp2)
			.concat([new THREE.Vector2(-12 - 9, 66 + expand)])
			.concat([new THREE.Vector2(-12 - 9, 66 - 2)])
			.concat([new THREE.Vector2(-12 - 2, 66 - 2)])
			.concat([new THREE.Vector2(-12 - 2, -12 - 2)])
		// const path = this.roofPath
		// const Meter1 = new THREE.MeshPhongMaterial({ color: color_floorslab })
		// console.log(path)
		const b = new Board('roof', path, height, 'Y', m_glass.clone())
		const f = b.createShape().create()
		setPotion(new THREE.Vector3(), f, 0, this.uHeight + height + y, 0)
		return f
	}
	roofRoom() {
		let path = [
			new THREE.Vector2(12 + 2, -12 - 2),
			new THREE.Vector2(12 + 2, 66 - 2),
			new THREE.Vector2(12 + 9, 66 - 2),
			new THREE.Vector2(12 + 9, 66),
			new THREE.Vector2(-12 - 9, 66),
			new THREE.Vector2(-12 - 9, 66 - 2),
			new THREE.Vector2(-12 - 2, 66 - 2),
			new THREE.Vector2(-12 - 2, -12 - 2),
			new THREE.Vector2(12 + 2, -12 - 2),
		]
		const _b = new Board('room', path, this.uHeight - 1, 'Y')
		const tb = new THREE.MeshLambertMaterial({ color: color_wall })
		_b.materials = tb
		let hpath = expandPath(path, new THREE.Vector2(0, 73), 2, 2)
		const hole = new THREE.Path(hpath)
		const obj = _b.createShape().addHole(hole).create()
		const { x, y, z } = obj.position
		setPotion(new THREE.Vector3(), obj, x, y + this.uHeight, z)
		const window = this.corridorWindow()[0]
		window.position.setY(this.uHeight)
		// setPotion(new THREE.Vector3(), window[0], x, y+this.uHeight, z)
		return [obj, window]
	}
	roofRoomBoard(height = 2, expand = 3, y = 0) {
		// 房盖path
		const tempPath = [
			new THREE.Vector2(12 + 2, -12 - 2),
			new THREE.Vector2(12 + 2, 66 - 2),
			new THREE.Vector2(12 + 9, 66 - 2),
			new THREE.Vector2(12 + 9, 66 + this.corridorDept),
			new THREE.Vector2(-12 - 9, 66 + this.corridorDept),
			new THREE.Vector2(-12 - 9, 66 - 2),
			new THREE.Vector2(-12 - 2, 66 - 2),
			new THREE.Vector2(-12 - 2, -12 - 2),
			new THREE.Vector2(12 + 2, -12 - 2),
		]
		let temp1 = expandPath(tempPath, new THREE.Vector2(0, 73), 1, expand)
		let temp2 = expandPath(mirrorCoords(tempPath), new THREE.Vector2(0, 73), 1, expand)
		const path = ([] as any[]).concat(temp1).concat(temp2)
		const _m_rf = m_fff.clone()
		_m_rf.opacity = 1
		const b = new Board('roofRoomBoard', path, height, 'Y', _m_rf)
		const f = b.createShape().create()
		setPotion(new THREE.Vector3(), f, 0, this.uHeight + height + y, 0)
		return f
	}
}
