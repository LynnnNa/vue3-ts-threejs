<template>
	<div id="demo" class="demo"></div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { modules } from '@/views/ZHSQ/modules'
import ResourceTracker from '/@/views/ZHSQ/modules/trackResource'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
// import { gsap } from 'gsap'
let clickedRoomId = ref('')
let progress = ref(0)
let bData = { name: '移动家属楼', fNum: 1, uNum: 1 }
let toCreateBuilding = true
onMounted(() => {
	const { query } = useRoute()
	const { f, u } = query
	if (f && u) toCreateBuilding = true
	const _f: any = f
	const _u: any = u
	bData.fNum = _f || bData.fNum
	bData.uNum = _u || bData.uNum
	init()
})
onBeforeUnmount(() => {
	distory()
})
let viewer: typeof modules.Viewer
let skyBoxs: typeof modules.SkyBoxs
let lights: typeof modules.Lights
let building: typeof modules.Building
let buildings: { building?: THREE.Group, nameTag?: CSS2DObject }
let gui: GUI
let resMgr = new ResourceTracker()
let tracker = resMgr.track.bind(resMgr)
let hasInitGlobleEvent = false
watch(
	progress,
	async (n: number) => {
		if (n >= 100) {
			setTimeout(async () => {
				Object.keys(buildings).forEach(m => {
					viewer.scene.add(buildings[m])
				})
				// startEventForBuilding()
				// console.log('场景添加楼栋',buildings)
			}, 1000);
		}
	}
)
function distory() {
	try {
		viewer.distroy()
		resMgr && resMgr.dispose()
	} catch (e) {
		console.log(e)
	}
}
async function init() {
	/* viewver */
	viewer = new modules.Viewer('demo')
	viewer.tracker = tracker
	// viewer.controls.maxPolarAngle = Math.PI / 2.2 //限制controls的上下角度范围
	viewer.camera.position.set(-480, 200, 800)
	// viewer.camera.position.set(9978, 4762, 9133)
	// viewer.controls.minDistance = 300
	/* 天空盒 */
	skyBoxs = new modules.SkyBoxs(viewer)
	skyBoxs.addSkybox(2)
	/* 光源 */
	lights = new modules.Lights(viewer)
	lights.addAmbientLight() // 添加环境光源
	lights.addDirectionalLight([200, -50, 200], {
		// 添加平行光源
		color: '#808080',
		intensity: 3,
		castShadow: true,
	})
	/* 地面 */
	// loadingGroud()
	/* 创建楼栋 */
	if (toCreateBuilding) buildings = await createBuilding(bData.name, bData.uNum, bData.fNum)
	progress.value = 100
	/* 调试 */
	setTimeout(() => {
		development()
	}, 1000);
}
function resetParams() {
	resMgr.dispose()
	buildings = {}
	progress.value = 0
}
function createBuilding(name: string, uNum: number, fNum: number) {
	bData.name = name || bData.name
	bData.uNum = uNum || bData.uNum
	bData.fNum = fNum || bData.fNum
	building = new modules.Building(viewer, bData, new THREE.Vector3(0, 0, 0))
	const b = viewer.tracker(building.createBuilding(2))
	return b
}
/* 建筑事件 */
function startEventForBuilding() {
	if (hasInitGlobleEvent) return
	viewer.startSelectEvent('mousemove', (Mesh: THREE.Mesh, point: THREE.Vector3) => {
		if (!Mesh) {
			building.removehoverRoom()
			return
		}
		if (Mesh.name === 'room') {
			building.hoverRoom(Mesh, point)
			return
		} else {
			building.removehoverRoom(Mesh, point)
		}
		return
	})
	viewer.startSelectEvent('click', (Mesh: THREE.Mesh, point: THREE.Vector3) => {
		// const env = ['EXPORT_GOOGLE_SAT_WM','Ways002','Ways001']
		// if (!Mesh || env.indexOf(Mesh.name)>-1) {
		if (!Mesh || Mesh.name !== 'room') {
			building.removeClickRoom()
			clickedRoomId.value = ''
			// building.clearIconTags()
			// building.resetCamera()
			return
		}
		if (Mesh.name === 'room') {
			building.click3DObj(Mesh, point)
			clickedRoomId.value = Mesh.parent?.userData.name
			return
		}

	})
	hasInitGlobleEvent = true
}
function development() {
	window.THREE = THREE
	window.viewer = viewer
	// window.building = building
	// window.nameTag = nameTag
	/* axes */
	const axes = new THREE.AxesHelper(300) // 红x  绿y 蓝z
	viewer.scene.add(axes)
	/* Stats */
	viewer.addStates()
	/* GUI */
	setTimeout(() => {
		initGui()
	}, 100)
}
function initGui() {
	gui = new GUI()
	// console.log(gui.domElement)
	gui.domElement.style.top = '60px'
	// const params = {
	// 	cssColor: '#ff00ff',
	// }
	// this.gui.addColor(params, 'cssColor')
	// const b = { fNum: bData.fNum, uNum: bData.uNum }
	const params = {
		楼栋颜色: '#ff00ff',
		楼栋名称: bData.name,
		楼层数: bData.fNum,
		单元数: bData.uNum,
		重新创建楼栋() {
			console.log('重新创建楼栋', this)
			resetParams()
			setTimeout(async () => {
				buildings = await createBuilding(this.楼栋名称, this.单元数, this.楼层数)
				progress.value = 100
			}, 100);
		},

		// scale: ground.scale.x,
		// x: ground.position.x,
		// y: ground.position.y,
		// z: ground.position.z,
	}
	gui.add(params, '楼栋名称')
	gui.add(params, '楼层数', 1, 10).step(1)
	gui.add(params, '单元数', 1, 5).step(1)
	// gui.addColor(params, '楼栋颜色')
	gui.add(params, '重新创建楼栋')
	gui.addColor(params, '楼栋颜色').onChange(e => {
		function search(children: Array<THREE.Object3D>) {
			children.forEach((item) => {
				/* 房间材质 */
				if ('room'.indexOf(item.name) > -1 && item.name) {
					item.material = new THREE.MeshPhysicalMaterial({
						color: e,
						transparent: true, // 透明度设置为 true
						opacity: 0.9, // 设置透明度
						roughness: 0,
						metalness: 0,
						envMapIntensity: 1,
						transmission: 0, // 折射度，表示光线经过材料时的衰减程度
						clearcoat: 1,
						clearcoatRoughness: 0,
						// refractionRatio: 2.5, // 折射率，控制光的折射程度
					})
				}
				/* 房间边线 */
				if (item.isMesh) {
				} else search(item.children)
			})
		}
		search(buildings.building?.children)
	})

	// gui.add(params, 'scale', 1, 10).onChange(e => {
	// 	ways.scale.set(e, e, e)
	// })
	// gui.add(params, 'x', -5700, 10000).step(20).onChange(e => {
	// 	ways.position.setX(e)
	// })
	// gui.add(params, 'y', -10000, 10000).onChange(e => {
	// 	ways.position.setY(e)
	// })
	// gui.add(params, 'z', -1000, 1000).onChange(e => {
	// 	ways.position.setZ(e)
	// })
	return gui
}

</script>
<style lang="scss">
.progress {
	position: fixed;
	left: 0;
	right: 0;
	top: 30%;
	width: 300px;
	margin: auto;
}

.demo {
	width: 100%;
	height: 100%;
}

.nameTag {
	// display: none;
	padding: 5px 20px;
	// background: $color;
	background: rgba(255, 255, 255, 0.2);
	color: #50dfdb;
	// font-weight: 700;
	// color: aliceblue;
	border-radius: 5px;
	cursor: pointer;
	border: 2px solid #2a3cad;
}

.roomTag {
	padding: 2px 2px;
	background: rgba(17, 24, 69, 0.6);
	color: yellow;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
	box-shadow: 2px 3px 2px #6e6e6e;
}

.float-wraper {
	position: absolute;
	top: 0;
	left: 0;
	font-size: 12px;
	height: 100%;
	top: 0;
}

.header {
	height: 50px;
	position: absolute;
	top: 0;
	left: 0;
	text-align: center;
	width: 100%;
	color: #50dfdb;
	font-size: 20px;

	.title {
		display: flex;
		justify-content: center;
		align-items: center;
	}

}
</style>
