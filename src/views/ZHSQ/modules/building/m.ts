import * as THREE from 'three'
export const color_wall = '#d4d4d4'
export const color_room = '#2a3cad'
export const color_floorslab = '#2a3cad'
export const color_floorslab2 = '#55d7ff'
export const color_line = '#05fbff'
export const m_blue = new THREE.MeshBasicMaterial({
	color: '#009EFF', // 颜色
	transparent: true, // 是否开启使用透明度
	opacity: 0.25, // 透明度
	depthWrite: false, // 关闭深度写入 透视效果
	side: THREE.DoubleSide, // 双面显示
})
export const m_cyanine = new THREE.MeshPhysicalMaterial({
	color: '#2a3cad',
	// color: '#05fbff',
	transparent: true, // 透明度设置为 true
	opacity: 0.7, // 设置透明度
	roughness: 0,
	metalness: 0,
	envMapIntensity: 1,
	transmission: 0, // 折射度，表示光线经过材料时的衰减程度
	clearcoat: 1,
	clearcoatRoughness: 0,
	// side: THREE.DoubleSide,
	// refractionRatio: 2.5, // 折射率，控制光的折射程度
})
export const m_fff = new THREE.MeshPhysicalMaterial({
	color: '#fff',
	transparent: true, // 透明度设置为 true
	opacity: 0.4, // 设置透明度
	roughness: 0,
	metalness: 0,
	envMapIntensity: 1,
	transmission: 0, // 折射度，表示光线经过材料时的衰减程度
	clearcoat: 1,
	clearcoatRoughness: 0,
	// refractionRatio: 2.5, // 折射率，控制光的折射程度
})
export const m_glass = new THREE.MeshPhysicalMaterial({
	color: color_room,
	transparent: true, // 透明度设置为 true
	opacity: 0.8, // 设置透明度
	roughness: 0,
	metalness: 0,
	envMapIntensity: 1,
	transmission: 0.6, // 折射度，表示光线经过材料时的衰减程度
	clearcoat: 1,
	clearcoatRoughness: 0,
	// refractionRatio: 2.5, // 折射率，控制光的折射程度
})
export const m_glass_2 = new THREE.MeshPhysicalMaterial({
	// color: 'blue',
	color: '#05fbff',
	transparent: true, // 透明度设置为 true
	opacity: 0.2, // 设置透明度
	roughness: 0,
	metalness: 0,
	envMapIntensity: 1,
	transmission: 0, // 折射度，表示光线经过材料时的衰减程度
	clearcoat: 1,
	clearcoatRoughness: 0,
	// refractionRatio: 2.5, // 折射率，控制光的折射程度
})
export default {}
