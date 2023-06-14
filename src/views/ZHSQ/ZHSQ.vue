<template>
	<div id="demo" class="demo"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { modules } from '@/views/ZHSQ/modules'
import * as THREE from 'three'
import gsap from 'gsap'
export default defineComponent({
	name: 'ZHSQ',
	props: {},
	setup() {
		onMounted(() => {
			init()
		})
		let viewer: modules.Viewer | undefined = undefined
		let skyBoxs: modules.SkyBoxs | undefined = undefined
		let modeloader: modules.ModelLoder | undefined = undefined
		let ground: modules.DsModel | undefined = undefined
		let office: any = undefined
		let oldOffice: modules.DsModel | undefined = undefined
		// let Mesh26: modules.DsModel | undefined = undefined
		let lights: modules.Lights | undefined = undefined
		// let modelMoveName: any = undefined
		let modelSelectName: any = undefined
		let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5']
		let building = THREE.Mesh
		function init() {
			/* viewver */
			viewer = new modules.Viewer('demo')
			// viewer.controls.maxPolarAngle = Math.PI * 100 //限制controls的上下角度范围
			viewer.camera.position.set(221, 70, 221)
			/* Stats */
			viewer.addStates()
			/* 天空盒 */
			skyBoxs = new modules.SkyBoxs(viewer)
			skyBoxs.addSkybox(0)
			/* 光源 */
			lights = new modules.Lights(viewer)
			lights.addAmbientLight() // 添加环境光源
			// lights.addDirectionalLight([10, 100, 100], {
			// 	// 添加平行光源
			// 	color: 'rgb(253,253,253)',
			// 	intensity: 3,
			// 	castShadow: true,
			// })
			/* 模型加载 */
			modeloader = new modules.ModelLoder(viewer)
			createBuilding()
			// viewer.camera.position.set(7, 37, 118)
			// loadGround()
			// loadBuild()
			// loadBuilding()
			// startEventForBuilding()
			/* development */
			development()
		}
		function createBuilding() {
			building = new modules.Building(new THREE.Vector3(0, 0, 0))
			viewer.scene.add(building)
		}
		function development() {
			window.THREE = THREE
			window.viewer = viewer
			window.office = office
			window.ground = ground
			window.building = building
			const axes = new THREE.AxesHelper(700) // 红x  绿y 蓝z
			viewer.scene.add(axes)
		}
		function loadBuilding() {
			modeloader?.loadModelToScene('build.glb', (_model: any) => {
				office = _model
				office.setCenter()
				// office.openCastShadow()
				// office.openReceiveShadow()
				console.log(office)
				office.object.name = '知政'
				office.object.rotation.y = Math.PI
				office.object.scale.set(0.2, 0.2, 0.2)
				office.object.position.set(16, 0, -5)
				office.object.children.forEach((item: any) => {
					item.name = item.name.replace('zuo', '')
					if (item.name == 'ding') {
						item.name = 6
					}
					item.name--
				})
				office.object.children
					.sort((a, b) => a.name - b.name)
					.forEach((v) => {
						v.name = 'zuo' + v.name
					})
				office.forEach((child: modules.DsModel) => {
					// console.log(child)
					if (child.isMesh) {
						child.frustumCulled = false
						child.material.emissive = child.material.color // 自发光
						child.material.emissiveMap = child.material.map // 自发光贴图
						child.material.emissiveIntensity = 1.2
						child.material.envmap = viewer.scene.background
					}
				})
				oldOffice = office.object.clone()
				// let box = office.getBox()
			})
		}
		/* 建筑事件 */
		function startEventForBuilding() {
			viewer.startSelectEvent('mousemove', (model: modules.DsModel) => {
				// 返回鼠标光线投射到的第一个模型
				if (model.parent?.parent?.name === '知政') {
					modelSelect.forEach((item) => {
						const isModelSelectName = modelSelectName == item
						if (isModelSelectName) return
						if (item == model.parent.name) {
							// 是鼠标映射到的
							// modelMoveName = item
							office.object.getObjectByName(item).traverse((child: any) => {
								// traverse遍历
								if (child.isMesh) {
									child.material = new THREE.MeshPhongMaterial({
										color: 'yellow',
										transparent: true,
										opacity: 0.7,
										emissive: child.material.color, // 材质的放射（光）颜色
										emissiveMap: child.material.map, // 放射（发光）贴图
										emissiveIntensity: 1, //放射光强度
									})
								}
							})
						} else {
							office.object.getObjectByName(item).traverse((child: modules.DsModel) => {
								if (child.isMesh) {
									if ((modelSelectName && isModelSelectName) || !modelSelectName) {
										let oldmodel = oldOffice.getObjectByName(item)
										child.material = oldmodel.getObjectByName(child.name).material
									} else {
										child.material = new THREE.MeshPhongMaterial({
											color: new THREE.Color('#123ca8'),
											transparent: true,
											opacity: 0.5,
											emissiveMap: child.material.map,
										})
									}
								}
							})
						}
					})
				}
			})
			viewer.startSelectEvent('click', (model: modules.DsModel) => {
				// 返回鼠标光线投射到的第一个模型
				if (model.parent?.parent?.name === '知政') {
					// if (model.parent.name == modelSelectName) return
					let modelSelectIndex = 0
					office.object.children.forEach((child, index) => {
						child.children.forEach((Mesh) => {
							if (child.name === modelSelectName) {
								child.children.forEach((Mesh) => {
									Mesh.material = oldmodel.getObjectByName(Mesh.name).material
								})
							} else {
								Mesh.material = new THREE.MeshPhongMaterial({
									color: new THREE.Color('#123ca8'),
									transparent: true,
									opacity: 0.5,
									emissiveMap: Mesh.material.map,
								})
							}
						})
						if (!model.userData.position && index > modelSelectIndex) {
							gsap.to(child.position, {
								y: !child.userData.position ? child.position.y + 25 : child.position.y,
								duration: 2,
								ease: 'power1.inOut',
								onComplete: () => {
									child.userData.position = true
								},
							})
						}
						if (model.userData.position && index <= modelSelectIndex) {
							if (child.userData.position) {
								gsap.to(child.position, {
									y: oldOffice.getObjectByName(child.name).position.y,
									duration: 2,
									ease: 'power1.inOut',
									onComplete: () => {
										child.userData.position = false
									},
								})
							}
						}
					})
					gsap.to(viewer.controls.target, {
						x: 6,
						y: -7,
						z: 1,
						duration: 2,
						ease: 'power1.inOut',
						onComplete: () => { },
					})
					gsap.to(viewer.camera.position, {
						x: 31,
						y: 20,
						z: 51,
						duration: 2,
						ease: 'power1.inOut',
						onComplete: () => { },
					})
				}
			})
		}
		/* 载入地面 */
		function loadGround() {
			modeloader.loadModelToScene(
				'city-v1.glb',
				(_model: modules.DsModel) => {
					ground = _model
					// ground.openCastShadow()
					// ground.openReceiveShadow()
					// ground.forEach(item => {
					// 	item.castShadow = true
					// 	item.receiveShadow = true
					// 	item.frustumCulled = false
					// 	item.material.emissiveMap = item.material.map
					// 	item.material.emissiveColor = item.material.color
					// })
				},
				(progress) => {
					// progress = Math.floor(progress * 100)
					// jindu_text.innerText = progress + '%'
					// jindu.style.width = progress + '%'
					// if (progress === 100) {
					// 	jindu_text_con.style.display = 'none'
					// }
				},
				(error) => {
					console.log(error)
				}
			)
		}
		/* 载入建筑 */
		function loadBuild() {
			modeloader?.loadModelToScene('zuo.glb', (_model: any) => {
				window.office = office = _model
				office.setCenter()
				// office.openCastShadow()
				// office.openReceiveShadow()
				console.log(office)
				office.object.name = '知政'
				office.object.rotation.y = Math.PI
				office.object.scale.set(0.2, 0.2, 0.2)
				office.object.position.set(16, 0, -5)
				office.object.children.forEach((item: any) => {
					item.name = item.name.replace('zuo', '')
					if (item.name == 'ding') {
						item.name = 6
					}
					item.name--
				})
				office.object.children
					.sort((a, b) => a.name - b.name)
					.forEach((v) => {
						v.name = 'zuo' + v.name
					})
				office.forEach((child: modules.DsModel) => {
					// console.log(child)
					if (child.isMesh) {
						child.frustumCulled = false
						child.material.emissive = child.material.color // 自发光
						child.material.emissiveMap = child.material.map // 自发光贴图
						child.material.emissiveIntensity = 1.2
						child.material.envmap = viewer.scene.background
					}
				})
				oldOffice = office.object.clone()
				// let box = office.getBox()
			})
		}
		return {}
	},
})
</script>
<style scoped lang="scss">
.demo {
	width: 100%;
	height: 100%;
}
</style>
