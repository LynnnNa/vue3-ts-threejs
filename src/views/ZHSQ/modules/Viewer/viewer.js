import { WebGLRenderer, PerspectiveCamera, Scene, Color, Vector2 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import MouseEvent from '../MouseEvent'
// 二维标签渲染器
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
// import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
export default class Viewer {
	constructor(id) {
		this.id = id
		this.viewerDom = undefined
		this.renderer = undefined
		this.scene = undefined
		this.camera = undefined
		this.controls = undefined
		this.statsControls = undefined
		this.composer = undefined
		this.renderPass = undefined
		this.outlinePass = undefined
		this.animate
		this.animateEventList = []
		this.percentage = 0
		this._initViewer()
	}
	distroy() {
		this.scene.clear()
		this.renderer.dispose()
		this.renderer.forceContextLoss()
		this.renderer.content = null
		cancelAnimationFrame(this.animate)
		let gl = this.renderer.domElement.getContext('demo')
		gl && gl.getExtension('WEBGL_lose_context').loseContext()
		console.log(this.renderer.info) //查看memery字段
	}
	/**
     * 添加全局的动画事件
     * @param animate 函数加参数对象
     * 传入对象 = {
            fun: 函数名称,
            content: 函数参数
        }
     */
	addAnimate(animate) {
		this.animateEventList.push(animate)
	}
	/* 状态检测 */
	addStates() {
		if (!this.statsControls) this.statsControls = new Stats()
		// this.statsControls.domElement.position = 'absolute'
		this.statsControls.dom.style.left = 'auto'
		this.statsControls.dom.style.right = '280px'
		this.statsControls.dom.style.top = '60px'
		// console.log(this.statsControls.dom)
		this.viewerDom.appendChild(this.statsControls.dom)
		this.statsUpdateObject = {
			fun: this._statsUpdate,
			content: this.statsControls,
		}
		this.addAnimate(this.statsUpdateObject)
	}
	/**
	 * 状态更新
	 * @param statsControls
	 */
	_statsUpdate(statsControls) {
		statsControls.update()
	}
	/**
	 * 创建初始化场景界面
	 */
	_initRenderer() {
		// 获取画布dom
		this.viewerDom = document.getElementById(this.id)
		// 初始化渲染器
		this.renderer = new WebGLRenderer({
			// antialias: true, // 抗锯齿
			precision: 'highp', // highp/mediump/lowp 表示着色精度选择
		})
		this.viewerDom.appendChild(this.renderer.domElement) // 一个canvas，渲染器在其上绘制输出。
		// 默认情况下，js的光强数值不真实。为了使得光强更趋于真实值，应该把渲染器的physicallyCorrectLights属性设为true
		// this.renderer.physicallyCorrectLights = true
		this.AddSceneTextCSS2DLabel()
	}
	AddSceneTextCSS2DLabel() {
		// 网页标签
		this.labelRenderer = new CSS2DRenderer()
		// this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
		// this.labelRenderer.domElement.className = 'labelRenderer'
		this.labelRenderer.domElement.style.zIndex = 2
		this.labelRenderer.domElement.style.position = 'absolute'
		this.labelRenderer.domElement.style.top = '0px'
		this.labelRenderer.domElement.style.left = '0px'
		this.labelRenderer.domElement.style.pointerEvents = 'none' // 避免HTML标签遮挡三维场景的鼠标事件
		this.viewerDom.appendChild(this.labelRenderer.domElement)
		// 三维标签
		// this.css3DRenderer = new CSS3DRenderer()
		// this.css3DRenderer.domElement.style.zIndex = 0
		// this.css3DRenderer.domElement.style.position = 'absolute'
		// this.css3DRenderer.domElement.style.top = '0px'
		// this.css3DRenderer.domElement.style.left = '0px'
		// this.css3DRenderer.domElement.style.pointerEvents = 'none' // 避免HTML标签遮挡三维场景的鼠标事件
		// this.viewerDom.appendChild(this.css3DRenderer.domElement)
	}
	_initCamera() {
		// 渲染相机
		// 视野范围 画布的宽高比 近平面 远平面
		this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
		this.camera.position.set(50, 0, 50)
		this.camera.lookAt(0, 0, 0)
	}

	_initScene() {
		// 渲染场景
		this.scene = new Scene()
		this.css3dScene = new Scene()
		this.scene.background = new Color('rgb(5,24,38)')
	}

	_initControl(option) {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = false // 开启阻尼
		this.controls.screenSpacePanning = false // 定义平移时如何平移相机的位置 控制不上下移动
	}
	// 添加skybox
	// _initSkybox() {
	// 	if (!this.skyboxs) this.skyboxs = new SkyBoxs(this)
	// 	this.skyboxs.addSkybox(0) // 'daytime', 'dusk', 'night'
	// }

	_initViewer() {
		this._initRenderer()
		// 渲染相机
		this._initCamera()
		// 渲染场景
		this._initScene()
		// 控制器
		this._initControl()
		// 天空盒
		// this._initSkybox()
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		// this.initOutlinePass()
		const _this = this

		this.animate = () => {
			requestAnimationFrame(this.animate)
			// this.progress()
			_this._undateDom()
			_this._readerDom()
			// 全局的公共动画函数，添加函数可同步执行
			_this.animateEventList.forEach((event) => {
				// console.log(event)
				event.fun && event.content && event.fun(event.content)
			})
		}

		this.animate()
	}
	// 更新dom大小
	_undateDom() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		that.controls.update()
		// 更新参数
		that.camera.aspect = that.viewerDom.clientWidth / that.viewerDom.clientHeight // 摄像机视锥体的长宽比，通常是使用画布的宽/画布的高
		that.camera.updateProjectionMatrix() // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用,来使得这些改变生效
		that.renderer.setSize(that.viewerDom.clientWidth, that.viewerDom.clientHeight)
		that.renderer.setPixelRatio(window.devicePixelRatio) // 设置设备像素比
		that.labelRenderer.setSize(that.viewerDom.clientWidth, that.viewerDom.clientHeight)
		// that.css3DRenderer.setSize(that.viewerDom.clientWidth, that.viewerDom.clientHeight)
	}

	// 渲染dom
	_readerDom() {
		// this.renderer.clear()
		this.renderer.render(this.scene, this.camera)
		// if (!this.composer) this.renderer.render(this.scene, this.camera)
		// else {
		// 	// console.log('composer render', this.outlinePass.selectedObjects[0].parent.userData.name)
		// 	this.composer.render()
		// }
		this.labelRenderer.render(this.scene, this.camera)
		// this.css3DRenderer.render(this.css3dScene, this.camera)
	}
	/**
	 * 开启鼠标事件
	 * @param mouseType
	 * @param isSelect
	 * @param callback
	 */
	startSelectEvent(mouseType, callback) {
		if (!this['mouseEvent' + mouseType]) this['mouseEvent' + mouseType] = new MouseEvent(this, callback, mouseType)
		this['mouseEvent' + mouseType].startSelect()
	}
	/**
	 * 关闭鼠标事件
	 */
	// stopSelectEvent() {
	// 	if (this.mouseEvent) {
	// 		this.mouseEvent.stopSelect()
	// 	}
	// }
	/* 效果组合器 */
	initEffectComposer() {
		this.composer = new EffectComposer(this.renderer)
		// this.composer.setSize(window.offsetWidth, window.offsetHeight)
	}
	/* 渲染通道 */
	initRenderPass() {
		if (!this.composer) this.initEffectComposer()
		this.renderPass = new RenderPass(this.scene, this.camera)
		this.composer.addPass(this.renderPass)
	}
	/* 创建OutlinePass通道 */
	initOutlinePass() {
		if (!this.renderPass) this.initRenderPass()
		this.outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera)
		this.outlinePass.edgeStrength = 10.0 // 边框的亮度
		this.outlinePass.edgeGlow = 1 // 光晕[0,1]
		this.outlinePass.usePatternTexture = false // 是否使用父级的材质
		this.outlinePass.edgeThickness = 1.0 // 边框宽度
		this.outlinePass.downSampleRatio = 2 // 边框弯曲度
		this.outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
		// this.outlinePass.visibleEdgeColor.set(parseInt(color)) // 呼吸显示的颜色
		// this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
		this.outlinePass.clear = true
		this.composer.addPass(this.outlinePass)
	}
	changeOutlinePassObjArray(arr, visibleColor) {
		if (!this.outlinePass) this.initOutlinePass(arr)
		// this.outlinePass.visibleEdgeColor = visibleColor
		this.outlinePass.selectedObjects = arr
		this.composer.render()
	}
}
