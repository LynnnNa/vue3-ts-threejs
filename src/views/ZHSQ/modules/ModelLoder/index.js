import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import DsModel from '../DsModel'
export default class ModelLoder {
	constructor(_viewer, resourcesUrl = 'node_modules/three/examples/jsm/libs/draco/') {
		this.viewer = _viewer
		this.scene = _viewer.scene
		this.loaderGltf = new GLTFLoader()
		this.loaderFBX = new FBXLoader()
		this.dracoLoader = new DRACOLoader() // 解码压缩网格数据
		this.dracoLoader.setDecoderPath(resourcesUrl) // 默认放在public文件夹当中
		this.loaderGltf.setDRACOLoader(this.dracoLoader) // DRACO压缩 gltf文件
	}
	/**
	 * 添加模型数据
	 * @param url 模型的路径
	 * @param callback 返回模型对象，常用一些功能挂接在模型对象上
	 * @param progress 返回加载进度，还有问题，需要修改
	 */
	loadModelToScene(url, callback, progress) {
		this.loadModel(
			url,
			(model) => {
				this.scene.add(this.viewer.tracker(model.object))
				callback && callback(model)
			},
			(num) => {
				progress && progress(num) // 输出加载进度
			}
		)
	}
	/**
	 * 加载模型
	 * @param url 模型路径
	 * @param callback 回调模型
	 * @param progress 返回加载进度
	 */
	loadModel(url, callback, progress) {
		// .load（url:字符串，onLoad:函数，onProgress:函数，onError:函数）
		//判断是否是fbx格式
		if (url.indexOf('.fbx') > -1) {
			this.loaderFBX.load(
				url,
				(gltf) => {
					callback && callback(new DsModel(gltf, this.viewer))
				},
				(xhr) => {
					progress && progress((xhr.loaded / xhr.total).toFixed(2)) // 输出加载进度
				}
			)
		} else {
			this.loaderGltf.load(
				url,
				(gltf) => {
					callback && callback(new DsModel(gltf, this.viewer))
				},
				(xhr) => {
					progress && progress((xhr.loaded / xhr.total).toFixed(2)) // 输出加载进度
				}
			)
		}
	}
}
