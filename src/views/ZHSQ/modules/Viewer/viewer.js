import { WebGLRenderer, PerspectiveCamera, Scene, Color } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import MouseEvent from '../MouseEvent'
export default class Viewer {
	constructor(id) {
		this.id = id
		this.viewerDom = undefined
		this.renderer = undefined
		this.scene = undefined
		this.camera = undefined
		this.controls = undefined
		this.statsControls = undefined
		this.animateEventList = []
		this._initViewer()
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
		this.statsControls.dom.position = 'absolute'
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
		this.renderer = new WebGLRenderer({})
		this.viewerDom.appendChild(this.renderer.domElement) // 一个canvas，渲染器在其上绘制输出。
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
		const _this = this

		function animate() {
			requestAnimationFrame(animate)
			_this._undateDom()
			_this._readerDom()
			// 全局的公共动画函数，添加函数可同步执行
			_this.animateEventList.forEach((event) => {
				event.fun && event.content && event.fun(event.content)
			})
		}

		animate()
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
		// that.labelRenderer.setSize(that.viewerDom.clientWidth, that.viewerDom.clientHeight)
		// that.css3DRenderer.setSize(that.viewerDom.clientWidth, that.viewerDom.clientHeight)
	}

	// 渲染dom
	_readerDom() {
		this.renderer.render(this.scene, this.camera)
		// this.labelRenderer.render(this.scene, this.camera)
		// this.css3DRenderer.render(this.css3dScene, this.camera)
	}
	/**
	 * 开启鼠标事件
	 * @param mouseType
	 * @param isSelect
	 * @param callback
	 */
	startSelectEvent(mouseType, callback) {
		console.log(mouseType)
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
}
