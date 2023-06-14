import * as THREE from 'three'
// 引入性能监视器，之前也没用过
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export default class ThreeJs {
	scene: THREE.Scene = new THREE.Scene()
	camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
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
		this.initScene()
		this.initRenderer()
		// this.initStats()
		const container = document.getElementById('demo')
		container?.appendChild(this.renderer.domElement)
		this.initCamera()
		this.initControls()
		this.todo()
		// 执行动画
		this.runAnimate()
	}
	todo(): void {
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		// 贴图 纹理
		const texture = new THREE.TextureLoader().load('/textures/crate.gif')
		texture.colorSpace = THREE.SRGBColorSpace
		// 上色 (跟贴图二选一)
		// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
		const material = new THREE.MeshBasicMaterial({ map: texture })
		const cube = new THREE.Mesh(geometry, material)
		this.scene.add(cube)
	}
	initCamera(): void {
		this.camera.position.set(1, 1, 3)
		// this.camera.position.z =
	}
	initControls(): void {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		// this.controls.target.set(0, 0.5, 0)
		// this.controls.update()
		// this.controls.enablePan = false
		// this.controls.enableDamping = true
	}
	initScene(): void {
		this.scene.background = new THREE.Color(0xbfe3dd)
		// const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
		// this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
	}
	initRenderer(): void {
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}
	initStats(): void {
		// 性能监听器
		// 修改一下位置
		this.stats.dom.style.position = 'relative'
		// 将性能监听器添加到容器中
		const container = document.getElementById('demo')
		container?.appendChild(this.stats.dom)
	}
	runAnimate(): void {
		requestAnimationFrame(() => this.runAnimate())
		// const delta = this.clock?.getDelta()
		// this.mixer?.update(delta)
		// this.controls.update()

		// this.stats?.update()
		this.renderer?.render(this.scene, this.camera)
	}
}
