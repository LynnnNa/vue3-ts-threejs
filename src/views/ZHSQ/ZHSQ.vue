<template>
	<div class="progress">
		<el-progress v-if="progress < 100" :percentage="progress" :stroke-width="10" />
	</div>
	<div id="demo" class="demo"></div>
	<div>
		<div class="header">
			<Box2>
				<div class="title">
					<StarFilled color="pink" style="width: 1.5em; height: 1.5em; margin-right: 8px" />智慧城市
				</div>
			</Box2>
		</div>
		<BuildingDetails v-if="showIntroduction" class="float-wraper" :clickedRoomId="clickedRoomId"
						 @reset="reset"
						 @changeTypeSpecial="changeTypeSpecial" />

	</div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { modules } from '@/views/ZHSQ/modules'
import ResourceTracker from '@/views/ZHSQ/modules/trackResource'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import BuildingDetails from '/@/views/ZHSQ/components/BuildingDetails.vue'
import Box2 from '/@/views/ZHSQ/components/boxes/Box2.vue'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import svgs from '/@/views/ZHSQ/modules/label/svg'
let clickedRoomId = ref('')
// export default defineComponent({
// name: 'ZHSQ',
// props: {},
// components: { BuildingDetails },
// setup() {
// let status = ref('')
let showIntroduction = ref(false)
let progress = ref(0)
let _progress = 0
let bData = { name: '移动家属楼', fNum: 7, uNum: 2 }
let toCreateBuilding = true
onMounted(() => {
	const { query } = useRoute()
	// console.log(query)
	const { f, u } = query
	if (f && u) toCreateBuilding = true
	const _f: any = f
	const _u: any = u
	bData.fNum = _f || bData.fNum
	bData.uNum = _u || bData.uNum
	init()
})
onBeforeUnmount(() => {
	try {
		viewer.distroy()
		resMgr && resMgr.dispose()
	} catch (e) {
		console.log(e)
	}
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
	(n: number) => {
		if (n >= 100) {
			Object.keys(buildings).forEach(m => {
				viewer.scene.add(buildings[m])
			})
			startEventForBuilding()
			setTimeout(() => {
				showIntroduction.value = true
			}, 200);
		}
	}
)
function init() {
	/* viewver */
	viewer = new modules.Viewer('demo')
	viewer.tracker = tracker
	viewer.controls.maxPolarAngle = Math.PI / 1.8 //限制controls的上下角度范围
	viewer.camera.position.set(-480, 200, 800)
	viewer.controls.minDistance = 300
	viewer.controls.maxDistance = 1300
	// viewer.percentage = progress // 渲染进度
	/* 天空盒 */
	skyBoxs = new modules.SkyBoxs(viewer)
	skyBoxs.addSkybox(2)
	/* 光源 */
	lights = new modules.Lights(viewer)
	lights.addAmbientLight() // 添加环境光源
	lights.addDirectionalLight([-100, -100, 100], {
		// 添加平行光源
		color: '#808080',
		intensity: 3,
		castShadow: true,
	})
	/* 创建楼栋 */
	if (toCreateBuilding) buildings = createBuilding(bData.name, bData.uNum, bData.fNum)
	/* 调试 */
	development()
	animate()
}
function animate() {
	// console.log(progress.value, _progress)
	if (!buildings?.building || progress.value >= 100) return
	requestAnimationFrame(animate)
	_progress++
	if (_progress % 10 === 0 && progress.value < 100) {
		if (_progress % 10 === 0 && progress.value < 88) {
			progress.value += 15
		} else
			progress.value += 0.5
	}
}
function createBuilding(name: string, uNum: number, fNum: number) {
	resMgr.dispose()
	// status.value = ''
	showIntroduction.value = false
	buildings = {}
	progress.value = 0
	_progress = 0
	bData.name = name || bData.name
	bData.uNum = uNum || bData.uNum
	bData.fNum = fNum || bData.fNum
	building = new modules.Building(viewer, bData, new THREE.Vector3(0, 0, 0))
	const b = viewer.tracker(building.createBuilding(1, bData.name))
	return b
}
function reset() {
	building.resetCamera()
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
		if (!Mesh) {
			building.removeClickRoom()
			clickedRoomId.value = ''
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
/* 特殊人群 */
function changeTypeSpecial(item) {
	// console.log(arguments)
	const { icon } = item
	const html = svgs[icon]
	building.clearIconTags()
	const _tableData = [
		'1单元101',
		'2单元302',
		'3单元401',
		'4单元701',
	]
	if(!html) return
	const iconTagsGroup = building.addIconTags(_tableData, icon, html)
	console.log(iconTagsGroup)
	iconTagsGroup.forEach(icon => {
		// viewer.scene.add(icon)
	});
}
function development() {
	window.THREE = THREE
	// window.viewer = viewer
	// window.building = building
	// window.nameTag = nameTag
	/* axes */
	// const axes = new THREE.AxesHelper(700) // 红x  绿y 蓝z
	// viewer.scene.add(axes)
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
		楼栋名称: bData.name,
		楼层数: bData.fNum,
		单元数: bData.uNum,
		重新创建楼栋() {
			console.log('重新创建楼栋', this)
			buildings = createBuilding(this.楼栋名称, this.单元数, this.楼层数)
			animate()
		},
	}
	gui.add(params, '楼栋名称')
	gui.add(params, '楼层数', 1, 10).step(1)
	gui.add(params, '单元数', 1, 5).step(1)
	gui.add(params, '重新创建楼栋')
	return gui
}
		// return {
		// }
	// },
// })
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
