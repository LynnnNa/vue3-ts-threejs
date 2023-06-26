import * as THREE from 'three'
import modules from '@/views/ZHSQ/modules'
import { setPotion, remove } from '@/views/ZHSQ/modules/building/common'
import Unit, { uWidth, uHeight /* , uDept */ } from '@/views/ZHSQ/modules/building/unit'
import { gsap } from 'gsap'
export default class Building {
	viewer: typeof modules.Viewer
	c: THREE.Vector3
	uNum = 1
	fNum = 1
	lastHoverMesh: THREE.Mesh
	lastHoverMeshClone: THREE.Mesh
	lastClickMesh: THREE.Mesh
	lastClickMeshClone: THREE.Mesh
	clickRoomTag: THREE.Sprite
	nameTag: THREE.Sprite
	roomTag: THREE.Sprite
	buildingGroup: THREE.Group
	lineGroup: THREE.Group
	bData = { name: '测试大楼', fNum: 7, uNum: 4 }
	tracker
	constructor(viewer: typeof modules.Viewer, bData = { name: '测试大楼', fNum: 7, uNum: 4 }, center = new THREE.Vector3(0, 0, 0)) {
		this.viewer = viewer
		this.bData = bData
		this.c = center
		this.uNum = bData.uNum
		this.fNum = bData.fNum
		this.tracker = viewer.tracker
		return this
	}
	// 1: 一梯两户, 2: 一梯三户
	createBuilding(unitType = 1, name = 'building') {
		const building = []
		for (let i = 0; i < this.fNum; i++) {
			const y = uHeight * i
			const cFloor = this.createFloor(unitType, i, !!(i === this.fNum - 1))
			const { x } = cFloor.position
			setPotion(new THREE.Vector3(), cFloor, x, y, 0)
			building.push(cFloor)
		}
		this.buildingGroup = this.createGroup(building)
		this.buildingGroup.userData.name = name
		this.buildingGroup.name = 'building'
		setPotion(new THREE.Vector3(), this.buildingGroup, 0, (-uHeight * (this.fNum - 1)) / 2, 0)
		this.tracker(this.createNameTag())
		this.resetCamera()
		return this.buildingGroup
	}
	createFloor(unitType = 1, currentFloor: number, isTop = false) {
		let group: Array<THREE.Group> = []
		const n = Math.floor(this.uNum / 2) // 单向量单元数(奇数时中间半个不计)
		const odd = !!(this.uNum % 2 === 1)
		/* 计算每个单元的中心点 */
		for (let i = 0; i < this.uNum; i++) {
			const x = uWidth * (i - n)
			const _u = new Unit(`${i + 1}单元`, currentFloor, new THREE.Vector3(x, 0, 0), unitType)
			if (isTop) _u.hasRoof = true
			const _unit = _u.createUnit()
			group = group.concat(_unit)
		}
		// const unit = new Unit(this.c, unitType).createUnit()
		const groupFoor = this.createGroup(group)
		// 偶数 想x正方向挪半个单元宽度
		if (!odd) {
			setPotion(new THREE.Vector3(), groupFoor, uWidth / 2)
		}
		return groupFoor
	}
	createGroup(layers: Array<THREE.Group>) {
		const group = new THREE.Group()
		layers.forEach((node) => {
			group.add(node)
		})
		return group
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
		if (name === 'roomL') px = p.x - uWidth / 4
		if (name === 'roomR') px = p.x + uWidth / 4
		const { /* x, y, */ z } = point
		this.roomTag.position.set(px, p.y + uHeight / 2, p.z)
		this.roomTag.name = 'roomTag'
		this.roomTag.userData.targetMeshUUid = mesh.uuid
		this.roomTag.userData.positionOrigin = new THREE.Vector3(px, p.y + uHeight / 2, p.z)
		this.viewer.scene.add(this.roomTag)
		gsap.to(this.roomTag.position, {
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
		this.nameTag.position.set(0, model.max.y + 30, 0)
		this.nameTag.name = this.buildingGroup.userData.name
		this.viewer.scene.add(this.tracker(this.nameTag))
		return this.nameTag
	}
	removehoverRoom() {
		if (this.lastHoverMesh) {
			if (!this.lastClickMesh || this.lastClickMesh.uuid !== this.lastHoverMesh.uuid) this.lastHoverMesh.material = this.lastHoverMeshClone.material
		}
		remove(this.roomTag, this.viewer.scene)
		this.lastHoverMesh = null
		this.lastHoverMeshClone = null
		this.roomTag = null
	}
	removeClickRoom() {
		/* 还原上一个点击对象材质 */
		if (this.lastClickMesh) {
			this.lastClickMesh.material = this.lastClickMeshClone.material
		}
		remove(this.lineGroup, this.viewer.scene)
		remove(this.clickRoomTag, this.viewer.scene)
		this.lastClickMesh = null
		this.lastClickMeshClone = null
		this.clickRoomTag = null
	}
	hoverRoom(mesh: THREE.Mesh, point: THREE.Vector3) {
		if (this.lastHoverMesh && this.lastHoverMesh.uuid === mesh.uuid) return
		if (this.lastClickMesh && this.lastClickMesh.uuid === mesh.uuid) return
		this.addRoomTag(mesh, point)
		if (this.lastHoverMesh) {
			if (!this.lastClickMesh || this.lastClickMesh.uuid !== this.lastHoverMesh.uuid) this.lastHoverMesh.material = this.lastHoverMeshClone.material
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
		this.clickRoomTag = this.roomTag.clone()
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
			this.lastClickMesh.material = this.lastClickMeshClone.material
		}
		this.lastClickMesh = mesh
		this.lastClickMeshClone = this.lastHoverMeshClone.clone()
		this.createOutline(mesh/* , new THREE.Color('#ff00ff') */)
		mesh.material = new THREE.MeshBasicMaterial({
			color: '#009EFF', // 颜色
			transparent: true, // 是否开启使用透明度
			opacity: 0.25, // 透明度
			depthWrite: false, // 关闭深度写入 透视效果
			side: THREE.DoubleSide, // 双面显示
		})
		if (changeCamera) this.clickChangeCamera(x, y, z)
	}
	createOutline(mesh: THREE.Mesh/* , visibleColor: THREE.Color */) {
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
			x: x > 0 ? x + 10 : x - 10,
			y: y > 0 ? y - 40 : y + 40,
			z: this.viewer.camera.position.z > 0 ? 600 : -600,
			duration: 1,
			ease: 'power1.inOut',
			onComplete: () => {},
		})
		gsap.to(this.viewer.controls.target, {
			x: x,
			y: y,
			z: z,
			duration: 1,
			ease: 'power1.inOut',
			onComplete: () => {},
		})
	}
	resetCamera(){
		// gsap.to(this.viewer.camera.position, {
		// 	x: 0,
		// 	y: y > 0 ? y - 40 : y + 40,
		// 	z: this.viewer.camera.position.z > 0 ? 600 : -600,
		// 	duration: 1,
		// 	ease: 'power1.inOut',
		// 	onComplete: () => {},
		// })
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
