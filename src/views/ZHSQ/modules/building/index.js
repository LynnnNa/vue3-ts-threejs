import * as THREE from 'three'
import Unit from './unit'
export default class Building {
	constructor(center = new THREE.Vector3(0, 0, 0)) {
		this.c = center
		const b = this.createBuilding()
		// console.log('createBuilding', b)
		return b
	}
	// 1: 一梯两户, 2: 一梯三户
	createBuilding(unitType = 1) {
		const unit = new Unit(this.c, unitType)
		const group = this.createGroup(unit)
		return group
	}
	createGroup(layers) {
		const group = new THREE.Group()
		layers.forEach((node) => {
			group.add(node)
		})
		return group
	}
}
