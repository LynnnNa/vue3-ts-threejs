import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
export default class MouseEvent {
	constructor(_viewer, _callback, _type = 'click') {
		this.viewer = _viewer
		this.callback = _callback
		this.type = _type
		return this
	}
	_event(_this, e) {
		// console.log(_this, e)
		const raycaster = new THREE.Raycaster() // 光线投射 鼠标拾取
		const pointer = new THREE.Vector2() // 二维向量 mouse
		// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
		pointer.x = (e.offsetX / _this.viewer.renderer.domElement.clientWidth) * 2 - 1
		pointer.y = -(e.offsetY / _this.viewer.renderer.domElement.clientHeight) * 2 + 1
		raycaster.setFromCamera(pointer, _this.viewer.camera) // 通过摄像机和鼠标位置更新射线
		const intersects = raycaster.intersectObject(_this.viewer.scene, true)
		if (intersects.length > 0 && intersects[0]) {
			intersects[0] && _this.callback(intersects[0].object, intersects[0].point)
		}
	}
	startSelect(isSelect = true) {
		// 开始绑定点击事件
		this.stopSelect()
		this.bingEvent = this._event.bind(this, this)
		this.viewer.renderer.domElement.addEventListener(this.type, this.bingEvent)
	}
	/**
	 * 关闭鼠标事件
	 */
	stopSelect() {
		this.viewer.renderer.domElement.removeEventListener(this.type, this.bingEvent) // 第一个this与第二个this不一样
	}
}
