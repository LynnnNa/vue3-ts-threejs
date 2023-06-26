<template>
	<div id="demo" class="demo"></div>
	<div>
	<building-details></building-details>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { modules } from '@/views/ZHSQ/modules'
import ResourceTracker from '@/views/ZHSQ/modules/trackResource'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import BuildingDetails from '/@/views/ZHSQ/component/BuildingDetails'
export default defineComponent({
	name: 'ZHSQ',
	props: {},
	setup() {
		let bData = { name: '移动家属楼', fNum: 7, uNum: 4 }
		let toCreateBuilding = false
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
		let gui: GUI
		let resMgr = new ResourceTracker()
		let tracker = resMgr.track.bind(resMgr)
		let hasInitGlobleEvent = false
		function init() {
			/* viewver */
			viewer = new modules.Viewer('demo')
			viewer.tracker = tracker
			viewer.controls.maxPolarAngle = Math.PI / 1.8 //限制controls的上下角度范围
			viewer.camera.position.set(-480, 200, 800)
			viewer.controls.minDistance = 300
			viewer.controls.maxDistance = 1300
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
			if (toCreateBuilding) createBuilding(bData.name, bData.uNum, bData.fNum)
			/* 调试 */
			development()
		}
		function createBuilding(name: string, uNum: number, fNum: number) {
			resMgr.dispose()
			// if (building) return
			bData.name = name || bData.name
			bData.uNum = uNum || bData.uNum
			bData.fNum = fNum || bData.fNum
			building = new modules.Building(viewer, bData, new THREE.Vector3(0, 0, 0))
			const b = viewer.tracker(building.createBuilding(1, bData.name))
			viewer.scene.add(b)
			/* 后期 */
			startEventForBuilding()
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
					// building.removeClickRoom()
					return
				}
				if (Mesh.name === 'room') {
					building.click3DObj(Mesh, point)
					return
				}
			})
			hasInitGlobleEvent = true
		}
		function development() {
			window.THREE = THREE
			// window.viewer = viewer
			// window.building = building
			// window.nameTag = nameTag
			/* axes */
			const axes = new THREE.AxesHelper(700) // 红x  绿y 蓝z
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
					createBuilding(this.楼栋名称, this.单元数, this.楼层数)
				},
			}
			gui.add(params, '楼栋名称')
			gui.add(params, '楼层数', 1, 7).step(1)
			gui.add(params, '单元数', 1, 4).step(1)
			gui.add(params, '重新创建楼栋')
			return gui
		}
		return {
			// viewer
		}
	},
})
</script>
<style lang="scss">
.demo {
	width: 100%;
	height: 100%;
}

.nameTag {
	padding: 10px 20px;
	// background: $color;
	background: rgba(255, 255, 255, 0.54);
	color: blue;
	// color: aliceblue;
	border-radius: 5px;
	cursor: pointer;
}

.roomTag {
	padding: 2px 2px;
	background: rgba(255, 255, 255, 0.54);
	color: blue;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
	box-shadow: 2px 3px 2px #6e6e6e;
}
</style>
