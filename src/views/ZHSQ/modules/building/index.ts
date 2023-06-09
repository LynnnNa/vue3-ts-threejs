import * as THREE from 'three'
import modules from '/@/views/ZHSQ/modules'
import { setPotion, remove, createGroup, createOutline } from '/@/views/ZHSQ/modules/building/common'
import { m_glass_2, m_glass, m_fff, m_cyanine, color_line } from '/@/views/ZHSQ/modules/building/m'
import Unit from '/@/views/ZHSQ/modules/building/unit'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { gsap } from 'gsap'
export default class Building {
	viewer: typeof modules.Viewer
	renderer: THREE.WebGLRenderer
	c: THREE.Vector3
	uNum = 1
	fNum = 1
	lastHoverMesh: THREE.Mesh | undefined
	lastHoverMeshClone: THREE.Mesh | undefined
	lastClickMesh: THREE.Mesh | undefined
	lastClickMeshClone: THREE.Mesh | undefined
	clickRoomTag: CSS2DObject | undefined
	nameTag: CSS2DObject | undefined
	roomTag: CSS2DObject | undefined
	buildingGroup: THREE.Group
	roomPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
	orridorPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
	linePlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
	lineFadePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
	floorPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)
	floorPlane2 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)
	plane = {}
	lineGroupTemp: THREE.Group
	lineGroup: THREE.Group
	iconTagsUUid: Set<string> = new Set()
	iconTags: Array<CSS2DObject> = new Array()
	bData = { name: '测试大楼', fNum: 7, uNum: 4 }
	tracker: typeof modules.Viewer.tracker
	uWidth: number
	uHeight: number
	totleHeight: number
	totleWidth: number

	constructor(viewer: typeof modules.Viewer, bData = { name: '测试大楼', fNum: 7, uNum: 4 }, center = new THREE.Vector3(0, 0, 0)) {
		this.viewer = viewer
		this.renderer = viewer.renderer
		this.renderer.localClippingEnabled = true
		this.bData = bData
		this.c = center
		this.uNum = bData.uNum
		this.fNum = bData.fNum
		this.tracker = viewer.tracker
		return this
	}
	async loadUtileModules(unitType = 1) {
		const _u = new Unit(unitType)
		const _module = await _u.loadUnitModuleData()
		this.uHeight = _module.uHeight
		this.uWidth = _module.uWidth
		this.totleHeight = this.uHeight * this.fNum
		this.totleWidth = this.uWidth * this.uNum
		return _module
	}
	// 1: 一梯两户, 2: 一梯三户
	async createBuilding(unitType = 1, isClip = false) {
		await this.loadUtileModules(unitType)
		const building: Array<THREE.Group> = []
		for (let i = 0; i < this.fNum; i++) {
			const y = this.uHeight * i
			const cFloor = await this.createFloor(unitType, i, !!(i === this.fNum - 1))
			cFloor.name = 'ground floor'
			const { x } = cFloor.position
			setPotion(new THREE.Vector3(), cFloor, x, y, 0)
			building.push(cFloor)
		}
		this.buildingGroup = createGroup(building)
		this.buildingGroup.userData.name = this.bData.name
		this.buildingGroup.name = 'building'
		// setPotion(new THREE.Vector3(), this.buildingGroup, 0, -this.totleHeight/2, 0)
		// this.resetCamera()
		const { lineGroup, lineGroup2 } = this.each3dObject(building, isClip)
		// this.lineGroupTemp = lineGroup
		return {
			building: this.tracker(this.buildingGroup),
			// nameTag: this.tracker(this.createNameTag()),
			lineGroup: lineGroup && this.tracker(lineGroup),
			lineGroup2: lineGroup2 && this.tracker(lineGroup2),
		}
	}
	clipBuiding() {
		return new Promise((res) => {
			const { roomPlane, orridorPlane, linePlane, lineFadePlane, floorPlane, floorPlane2 } = this
			let tLine = -200
			let tFloor = 0
			let tRoom = 0
			// let addedRoof = false
			const animate = {
				fun: () => {
					// console.log('clipBuiding')
					// if (addedRoof) return
					if (tRoom >= this.totleHeight + 10 && tFloor >= this.totleWidth + 10) {
						remove(this.lineGroupTemp, this.viewer.scene)
						this.viewer.removeAnimate('clipBuiding')
						res(true)
						return
					}
					linePlane.constant = tLine = tLine + 2
					if (tLine >= this.totleHeight) {
						tFloor += 4
						floorPlane.constant = tFloor
						floorPlane2.constant = tFloor
					}
					if (tFloor >= this.totleWidth / 3) {
						tRoom += 4
						roomPlane.constant = tRoom
						orridorPlane.constant = tRoom
						lineFadePlane.constant = tRoom
					}
				},
				name: 'clipBuiding',
				content: null,
			}
			this.viewer.addAnimate(animate)
		})
	}
	each3dObject(b: Array<THREE.Object3D>, isClip = false) {
		// const allRooms: Array<THREE.Object3D> = []
		const allRoomsLines: Array<THREE.Object3D> = []
		const allRoomsLines2: Array<THREE.Object3D> = []
		const { roomPlane, orridorPlane, linePlane, lineFadePlane, floorPlane, floorPlane2 } = this
		function search(children: Array<THREE.Object3D>) {
			children.forEach((item) => {
				/* 房盖 */
				if ('roof'.indexOf(item.name) > -1 && item.name) {
					const _m_rf = m_fff.clone()
					_m_rf.opacity = 1
					item.material = _m_rf
					if (isClip) item.material.clippingPlanes = [floorPlane, floorPlane2]
				}
				/* 楼板 */
				if ('floorslab'.indexOf(item.name) > -1 && item.name) {
					item.material = m_fff.clone()
					if (isClip) item.material.clippingPlanes = [floorPlane, floorPlane2]
				}
				/* 楼道窗户材质 */
				if ('corridorWindow'.indexOf(item.name) > -1 && item.name) {
					const _m_cyanine = m_cyanine.clone()
					_m_cyanine.side = THREE.DoubleSide
					item.material = _m_cyanine
					if (isClip) item.material.clippingPlanes = [orridorPlane]
				}
				/* 电梯井墙壁材质 */
				/* if ('elevatorShaft'.indexOf(item.name) > -1 && item.name) {
					item.material = m_glass_2.clone()
					if (isClip) item.material.clippingPlanes = [orridorPlane]
				} */
				/* 房间材质 */
				if ('room'.indexOf(item.name) > -1 && item.name) {
					const _m_cyanine = m_cyanine.clone()
					_m_cyanine.side = THREE.DoubleSide
					item.material = _m_cyanine
					if (isClip) item.material.clippingPlanes = [roomPlane]
				}
				/* 房间边线 */
				if (item.isMesh) {
					const line = createOutline(item, color_line, 0.5)
					line.children[0].material.clippingPlanes = [linePlane, lineFadePlane]
					const line2 = createOutline(item, 'blue', 0.5)
					line2.children[0].material.clippingPlanes = [roomPlane]
					allRoomsLines.push(line)
					allRoomsLines2.push(line2)
				} else search(item.children)
			})
		}
		search(b)
		const lineGroup = createGroup(allRoomsLines)
		const lineGroup2 = createGroup(allRoomsLines2)
		return { lineGroup, lineGroup2 }
	}
	async createFloor(unitType = 1, currentFloor: number, isTop = false) {
		let group: Array<THREE.Group> = []
		const n = Math.floor(this.uNum / 2) // 单向量单元数(奇数时中间半个不计)
		const odd = !!(this.uNum % 2 === 1)
		/* 计算每个单元的中心点 */
		for (let i = 0; i < this.uNum; i++) {
			const x = this.uWidth * (i - n)
			const _u = new Unit(unitType, `${i + 1}单元`, currentFloor, new THREE.Vector3(x, 0, 0), isTop)
			const _unit = await _u.createUnit()
			group = group.concat(_unit)
		}
		const groupFoor = createGroup(group)
		// 偶数 想x正方向挪半个单元宽度
		if (!odd) {
			setPotion(new THREE.Vector3(), groupFoor, this.uWidth / 2)
		}
		return groupFoor
	}
	addRoomTag(mesh: THREE.Mesh, point: THREE.Vector3) {
		if (this.roomTag && mesh.uuid === this.roomTag.userData.targetMeshUUid) return
		remove(this.roomTag, this.viewer.scene)
		const labels = new modules.Labels()
		let meshP: THREE.Mesh | THREE.Group | THREE.Object3D = mesh
		if (mesh.isMesh) {
			meshP = mesh.parent || mesh
		}
		const p = meshP.getWorldPosition(new THREE.Vector3())
		const name = meshP.name
		const userDataName = meshP.userData.name
		let px = p.x
		this.roomTag = labels.roomTag(userDataName)
		if (name === 'roomL') px = p.x - this.uWidth / 4
		if (name === 'roomR') px = p.x + this.uWidth / 4
		const { /* x, y, */ z } = point
		this.roomTag!.position.set(px, p.y + this.uHeight / 2, p.z)
		this.roomTag!.name = 'roomTag'
		this.roomTag!.userData.targetMeshUUid = mesh.uuid
		this.roomTag!.userData.positionOrigin = new THREE.Vector3(px, p.y + this.uHeight / 2, p.z)
		this.viewer.scene.add(this.tracker(this.roomTag))
		gsap.to(this.roomTag!.position, {
			z,
			duration: 0.7,
		})
	}
	createNameTag() {
		const model = new THREE.Box3().setFromObject(this.buildingGroup)
		// const v3 = new THREE.Vector3()
		// const size = model.getSize(v3)
		// console.log(size)
		const labels = new modules.Labels()
		this.nameTag = labels.nameTag(this.bData.name)
		this.nameTag!.position.set(0, model.max.y + 50, 0)
		this.nameTag!.name = this.buildingGroup.userData.name
		// this.viewer.scene.add(this.tracker(this.nameTag))
		return this.nameTag
	}
	removehoverRoom() {
		if (this.lastHoverMesh) {
			if (!this.lastClickMesh || this.lastClickMesh.uuid !== this.lastHoverMesh.uuid) this.lastHoverMesh.material = this.lastHoverMeshClone!.material
		}
		remove(this.roomTag, this.viewer.scene)
		this.lastHoverMesh = undefined
		this.lastHoverMeshClone = undefined
		this.roomTag = undefined
	}
	removeClickRoom() {
		/* 还原上一个点击对象材质 */
		if (this.lastClickMesh) {
			this.lastClickMesh.material = this.lastClickMeshClone!.material
		}
		remove(this.lineGroup, this.viewer.scene)
		remove(this.clickRoomTag, this.viewer.scene)
		this.lastClickMesh = undefined
		this.lastClickMeshClone = undefined
		this.clickRoomTag = undefined
	}
	hoverRoom(mesh: THREE.Mesh, point: THREE.Vector3) {
		if (this.lastHoverMesh && this.lastHoverMesh.uuid === mesh.uuid) return
		if (this.lastClickMesh && this.lastClickMesh.uuid === mesh.uuid) return
		this.addRoomTag(mesh, point)
		if (this.lastHoverMesh) {
			if (!this.lastClickMesh || this.lastClickMesh.uuid !== this.lastHoverMesh.uuid) this.lastHoverMesh.material = this.lastHoverMeshClone!.material
		}
		this.lastHoverMesh = mesh
		this.lastHoverMeshClone = mesh.clone()
		mesh.material = new THREE.MeshPhongMaterial({
			color: 'yellow',
			transparent: true, // 是否开启使用透明度
			opacity: 0.25, // 透明度
			depthWrite: false, // 关闭深度写入 透视效果
			side: THREE.DoubleSide, // 双面显示
		})
	}
	click3DObj(mesh: THREE.Mesh, changeCamera = true /* , point: THREE.Vector3 */) {
		if (mesh.name !== 'room') return
		if (this.lastClickMesh && this.lastClickMesh.uuid === mesh.uuid) return
		remove(this.lineGroup, this.viewer.scene)
		/* 固定当前对象roomTag */
		remove(this.clickRoomTag, this.viewer.scene)
		this.clickRoomTag = this.roomTag!.clone()
		const { x, y, z } = this.clickRoomTag.userData.positionOrigin
		// this.clickRoomTag.position.set(x, y, z)
		gsap.to(this.clickRoomTag.position, {
			z,
			duration: 0.2,
		})
		this.viewer.scene.add(this.tracker(this.clickRoomTag))
		remove(this.roomTag, this.viewer.scene)
		/* 还原上一个点击对象材质 */
		if (this.lastClickMesh) {
			this.lastClickMesh.material = this.lastClickMeshClone!.material
		}
		this.lastClickMesh = mesh
		this.lastClickMeshClone = this.lastHoverMeshClone!.clone()
		this.createOutline(mesh /* , new THREE.Color('#ff00ff') */)
		mesh.material = new THREE.MeshBasicMaterial({
			color: '#009EFF', // 颜色
			transparent: true, // 是否开启使用透明度
			opacity: 0.25, // 透明度
			depthWrite: false, // 关闭深度写入 透视效果
			side: THREE.DoubleSide, // 双面显示
		})
		if (changeCamera) this.clickChangeCamera(x, y, z)
	}
	createOutline(mesh: THREE.Mesh /* , visibleColor: THREE.Color */) {
		const position = mesh.getWorldPosition(new THREE.Vector3())
		this.lineGroup = new THREE.Group()
		const lineMEterial = new THREE.LineBasicMaterial({
			color: '#36BCFF',
			transparent: true,
			opacity: 0.4,
			depthWrite: false,
			side: THREE.DoubleSide,
		})
		const edges = new THREE.EdgesGeometry(mesh.geometry)
		const lineS = new THREE.LineSegments(edges, lineMEterial)
		this.lineGroup.add(lineS)
		const { x, y, z } = position
		this.lineGroup.position.set(x, y, z)
		this.viewer.scene.add(this.tracker(this.lineGroup))
		const { direction } = mesh.userData
		if (direction === 'Y') {
			this.lineGroup.rotateX(Math.PI / 2)
		}
	}
	clickChangeCamera(x: number, y: number, z: number) {
		gsap.to(this.viewer.camera.position, {
			x: -this.totleWidth / 2 + x / 10,
			y: this.totleHeight / 2 + y / 10,
			z: this.viewer.camera.position.z > 0 ? 800 : -800,
			duration: 1,
			ease: 'power1.inOut',
			onComplete: () => {},
		})
		gsap.to(this.viewer.controls.target, {
			x: 0,
			y: y,
			z: z,
			duration: 1,
			ease: 'power1.inOut',
			onComplete: () => {},
		})
	}
	clearIconTags() {
		console.log('clear')
		this.iconTags.forEach((icon) => {
			remove(icon, this.viewer.scene)
		})
	}
	addIconTags(roomIds: Array<object>, iconName = '', html = '') {
		roomIds
		// const ids = foomIds.map()
		// roomIds.forEach(r=>{
		// 	this.addIconTag(r.roomId)
		// })
		const a = ['roomL', 'roomR']
		const allRooms: Array<THREE.Object3D> = []
		function search(children: Array<THREE.Object3D>) {
			children.forEach((item) => {
				if (a.indexOf(item.name) > -1) {
					const n = Math.floor(Math.random() * 6)
					if (n === 1) allRooms.push(item)
				} else search(item.children)
			})
		}
		search(this.buildingGroup.children)
		const iconTags = allRooms.map((room: THREE.Group) => {
			return this.tracker(this.createIconTag(room, iconName, html))
		})
		return iconTags
	}
	createIconTag(mesh: THREE.Group, tagName: string = 'icon', iconHtml?: string) {
		if (this.iconTagsUUid.has(tagName + mesh.uuid)) return
		this.iconTagsUUid.add(tagName + mesh.uuid)
		mesh.userData.hasIconNum = mesh.userData.hasIconNum || 0
		mesh.userData.hasIconNum++
		const labels = new modules.Labels()
		const p = mesh.getWorldPosition(new THREE.Vector3())
		const name = mesh.name
		let px = p.x
		const iconTag = labels.iconTag(iconHtml)
		if (name === 'roomL') px = p.x - this.uWidth / 4 + (mesh.userData.hasIconNum - 1) * 15
		if (name === 'roomR') px = p.x + this.uWidth / 4 - (mesh.userData.hasIconNum - 1) * 15
		// const z = 65
		iconTag.position.set(px, p.y + this.uHeight / 2, p.z)
		iconTag.name = tagName
		iconTag.userData.targetMeshUUid = mesh.uuid
		iconTag.userData.positionOrigin = new THREE.Vector3(px, p.y + this.uHeight / 2, p.z)
		this.iconTags.push(iconTag)
		this.viewer.scene.add(this.tracker(iconTag))
		gsap.to(iconTag!.position, {
			z: 10,
			duration: 0.7,
			ease: 'Bounce.inOut',
		})
		gsap.to(iconTag!.position, {
			y: iconTag.position.y - 10,
			repeat: -1,
			yoyo: true,
			duration: 2,
			ease: 'Bounce.inOut',
		})
		// console.log(iconTag)
		return iconTag
	}
	resetCamera() {
		// viewer.camera.position.set(-480, 200, 800)
		gsap.to(this.viewer.camera.position, {
			x: -480,
			y: 400,
			z: 800,
			duration: 1.5,
			ease: 'power1.inOut',
			onComplete: () => {},
		})
		gsap.to(this.viewer.controls.target, {
			x: 0,
			y: 0,
			z: 0,
			duration: 1,
			ease: 'power1.inOut',
			// onComplete: () => {},
		})
	}
	// createOutline(objectsArray: Array<THREE.Mesh>, visibleColor: THREE.Color) {
	// 	// this.viewer.changeOutlinePassObjArray(objectsArray, visibleColor)
	// }
}
