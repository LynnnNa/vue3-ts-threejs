import * as THREE from "three"
// 引入性能监视器，之前也没用过
import Stats from "@/libs/jsm/libs/stats.module"
import { OrbitControls } from "@/libs/jsm/controls/OrbitControls"
import { GLTFLoader } from "@/libs/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "@/libs/jsm/loaders/DRACOLoader"
import { RoomEnvironment } from "@/libs/jsm/environments/RoomEnvironment.js"

export default class ThreeJs {
	scene: THREE.Scene = new THREE.Scene()
	camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(40, 1.25, 1, 100)
	renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true })
	// ambientLight: THREE.AmbientLight | null = null
	// mesh: THREE.Mesh | null = null
	stats: Stats = new Stats() // 性能监听器
	mixer: THREE.AnimationMixer | null = null
	clock: THREE.Clock = new THREE.Clock()
	controls: OrbitControls | null = null

	constructor() {
		this.init()
	}
	init(): void {
		this.initRenderer()
		this.initScene()
		this.initStats()
		const container = document.getElementById("demo")
		container?.appendChild(this.renderer.domElement)
		this.initCamera()
		this.initControls()
		this.dracoLoader()
	}
	dracoLoader(): void {
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath("/libs/jsm/libs/draco/gltf/")
		// 创建模型加载器并加载模型
		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)
		loader.load(
			"/libs/models/gltf/LittlestTokyo.glb",
			(gltf: { scene: any; animations: any[] }) => {
				const model = gltf.scene
				// 设置模型的位置
				model.position.set(1, 1, 0)
				// 设置视角
				model.scale.set(0.01, 0.01, 0.01)
				// 将模型添加到场景中
				this.scene?.add(model)

				// 创建一个动画混合器，动画混合器是用于场景中特定对象的动画的播放器。当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。
				this.mixer = new THREE.AnimationMixer(model)
				// 设置剪辑动画
				this.mixer.clipAction(gltf.animations[0]).play()
				// 执行动画
				this.runAnimate()
			},
			undefined,
			function (e: any) {
				console.error(e)
			}
		)
	}
	initCamera(): void {
		this.camera.position.set(5, 2, 8)
	}
	initControls(): void {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.target.set(0, 0.5, 0)
		this.controls.update()
		this.controls.enablePan = false
		this.controls.enableDamping = true
	}
	initScene(): void {
		this.scene.background = new THREE.Color(0xbfe3dd)
		const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
		this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
	}
	initRenderer(): void {
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}
	initStats(): void {
		// 性能监听器
		// 修改一下位置
		this.stats.dom.style.position = "relative"
		// 将性能监听器添加到容器中
		const container = document.getElementById("demo")
		container?.appendChild(this.stats.dom)
	}
	runAnimate(): void {
		requestAnimationFrame(() => this.runAnimate())
		const delta = this.clock?.getDelta()
		this.mixer?.update(delta)
		this.controls.update()

		this.stats?.update()
		this.renderer?.render(this.scene, this.camera)
	}
}
