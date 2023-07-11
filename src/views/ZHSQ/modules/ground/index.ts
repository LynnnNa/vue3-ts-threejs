import ModelLoder from '/@/views/ZHSQ/modules/ModelLoder'
import DsModel from '/@/views/ZHSQ/modules/DsModel'
import modules from '/@/views/ZHSQ/modules'
import { createGroup } from '/@/views/ZHSQ/modules/building/common'
import * as THREE from 'three'
export default class Ground {
	viewer: typeof modules.Viewer
	loader: ModelLoder
	ways: THREE.Group
	waysBg: THREE.Group
	texture: THREE.Texture
	roadMaterial: THREE.Material
	constructor(viewer: typeof modules.Viewer) {
		this.viewer = viewer
		this.loader = new ModelLoder(viewer)
	}
	addGrid() {
		//网格线绘制
		// 2a3cad 蓝 183c1a 绿
		var grid = new THREE.GridHelper(8000, 400, '#2a3cad', '#2a3cad')
		grid.material.opacity = 0.3
		grid.material.transparent = true
		// this.viewer.scene.add(grid)
		return this.viewer.tracker(grid)
	}
	addGround(progress: Function) {
		return new Promise((res) => {
			return this.loader.loadModelToScene(
				// 'http://47.93.98.160:9202/modules/thxcq_layer2.gltf',
				'modules/thxcq_layer2.gltf',
				(_model: DsModel) => {
					const ground = _model.object
					ground.name = '地形'
					ground.position.setY(-4240)
					ground.scale.set(4, 4, 4)
					ground.children[0].material.transparent = true
					res(ground)
				},
				(num: number) => {
					progress(num)
				}
			)
		})
	}
	addBuildings() {
		return new Promise((res) => {
			this.loader.loadModelToScene(
				'modules/buildings2.gltf',
				(_model: DsModel) => {
					// console.log(_model)
					const buildings = _model.object
					buildings.name = '建筑群'
					buildings.position.setX(4640)
					buildings.position.setZ(-250)
					buildings.position.setY(0)
					buildings.scale.set(5, 5, 5)
					buildings.children[0].material = new THREE.MeshBasicMaterial({
						color: '#999', // 颜色
						transparent: true, // 是否开启使用透明度
						opacity: 0, // 透明度
						depthWrite: false, // 关闭深度写入 透视效果
						side: THREE.DoubleSide, // 双面显示
					})
					res(buildings)
				},
				(num: number) => {
					num
				}
			)
		})
	}
	addWays() {
		return new Promise((res) => {
			this.loader.loadModelToScene(
				'modules/ways.gltf',
				async (_model: DsModel) => {
					this.waysBg = _model.object
					this.waysBg.scale.set(5.625, 5.625, 5.625)
					this.waysBg.position.set(6880, 0, -660)
					/* 底色 */
					this.waysBg.name = '道路底色'
					const textureBg = new THREE.MeshBasicMaterial({
						color: '#2a3cad', // 颜色
						transparent: true, // 是否开启使用透明度
						opacity: 0.4, // 透明度
						depthWrite: false, // 关闭深度写入 透视效果
						// side: THREE.DoubleSide, // 双面显示
					})
					this.waysBg.children.forEach((mesh: THREE.Mesh) => {
						mesh.frustumCulled = false
						mesh.material = textureBg
					})
					await this.addWaysLight()
					const group = createGroup([this.waysBg, this.ways])
					this.viewer.scene.add(this.viewer.tracker(group))
					res(group)
				},
				(num: number) => {
					num
				}
			)
		})
	}
	/* 车流 */
	addWaysLight() {
		return new Promise((res) => {
			this.loader.loadModelToScene(
				'modules/wayslight.gltf',
				(_model: DsModel) => {
					// console.log(_model)
					this.ways = _model.object
					this.ways.scale.set(5.625, 5.625, 5.625)
					this.ways.position.set(6880, 0, -660)
					this.ways.name = '车流'
					this.ways.position.setY(this.waysBg.position.y + 15)
					const textureLoader = new THREE.TextureLoader()
					let url = 'texture/traffic_01.png'
					// let url = 'texture/line.png'
					this.texture = textureLoader.load(url)
					this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping //每个都重复
					this.texture.repeat.set(1, 1)
					this.texture.needsUpdate = true
					this.roadMaterial = new THREE.MeshBasicMaterial({
						map: this.texture,
						side: THREE.FrontSide,
						opacity: 0, // 透明度
						transparent: true,
					})
					this.ways.children.forEach((mesh: THREE.Mesh) => {
						mesh.frustumCulled = false
						mesh.material = this.roadMaterial
					})
					res(this.ways)
				},
				(num: number) => {
					num
				}
			)
		})
	}
	addWaysLightAnimation(){
		let lastSecond = new Date().getSeconds()
		const animate = {
			fun: () => {
				// console.log(new Date().getSeconds())

				const now = new Date().getSeconds()
				const s = new Date().getMilliseconds()
				this.texture.offset.x -= 0.01
				if (s > 600) this.roadMaterial.opacity -= 0.01
				else this.roadMaterial.opacity += 0.01
				if (lastSecond !== now) {
					lastSecond = now
					this.roadMaterial.opacity = 0.4
					// console.log('now', now)
				}
			},
			content: null,
		}
		this.viewer.addAnimate(animate)
	}
}
