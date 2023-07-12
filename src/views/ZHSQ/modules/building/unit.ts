// import { setPotion, createGroup, mirrorCoords, createOutline } from './common'
// import Board from '/@/views/ZHSQ/modules/building/board'
import * as THREE from 'three'
// import { m_blue, m_glass, color_floorslab, color_wall } from '/@/views/ZHSQ/modules/building/m'

export default class Unit {
	uName = ''
	currentFloor = 0
	c = new THREE.Vector3(0, 0, 0)
	unitType = 0
	hasRoof = false
	constructor(unitType = 1, name = '', currentFloor = 0, center = new THREE.Vector3(0, 0, 0), isTop = false) {
		this.uName = name
		this.currentFloor = currentFloor
		this.c = center
		this.unitType = unitType
		this.hasRoof = isTop
		return this
	}
	async loadUnitModuleData() {
		const moduleClass = await import(`./unitData/m${this.unitType}.ts`) 
		const _module = new moduleClass.default(this.uName, this.currentFloor, this.c, this.hasRoof)
		return _module
	}
	async createUnit() {
		const _module = await this.loadUnitModuleData()
		const unitGroup = _module.createUnit()
		return unitGroup
	}
}
