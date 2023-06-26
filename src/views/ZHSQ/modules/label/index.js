import { Texture, SpriteMaterial, Sprite, Vector3 } from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
// import * as THREE from 'three'

export default class Labels {
	constructor() {
		return this
	}

	addCss2dLabel(html = '', position = new Vector3()) {
		const div = document.createElement('div')
		div.style.position = 'absolute'
		div.innerHTML = html
		const label = new CSS2DObject(div)
		// this.label.position.set(position.x, position.y, position.z)
		return label
	}
	nameTag(text = 'placehoder') {
		const label = this.addCss2dLabel(`<span class="nameTag">${text}</span>`)
		return label
	}
	roomTag(text = 'placehoder') {
		const label = this.addCss2dLabel(`<span class="roomTag">${text}</span>`)
		// label.element.style.opacity = 0
		// label.visible = false
		return label
	}
	nameTagByCanvas(
		text = 'placehoder',
		style = {
			fontSize: '148',
			borderWidth: '4',
			bg: 'rgba(138, 167,255,0.4)',
			borderColor: 'rgba(138, 167,255,0.9)',
		}
	) {
		const { fontSize, borderWidth, bg, borderColor } = style
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		/* text */
		context.font = `${fontSize}px Arial`
		context.fillText(text, borderWidth, fontSize + borderWidth)
		const m = context.measureText(text)
		const textW = m.width
		/* style */
		context.fillStyle = bg
		context.strokeStyle = borderColor
		context.lineWidth = borderWidth
		// roundRect(context, borderWidth / 2, borderWidth / 2, textW + borderWidth, fontSize * 1.4 + borderWidth, 6)
		/* Texture */
		const texture = new Texture(canvas)
		texture.needsUpdate = true
		/* sprite */
		const spriteMaterial = new SpriteMaterial({ map: texture })
		const sprite = new Sprite(spriteMaterial)
		sprite.scale.set(200, 100, 0)
		return sprite
		function roundRect(ctx, x, y, w, h, r) {
			ctx.beginPath()
			ctx.moveTo(x + r, y)
			ctx.lineTo(x + w - r, y)
			// ctx.quadraticCurveTo(x + w, y, x + w, y + r)
			ctx.lineTo(x + w, y + h - r)
			// ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
			ctx.lineTo(x + r, y + h)
			// ctx.quadraticCurveTo(x, y + h, x, y + h - r)
			ctx.lineTo(x, y + r)
			// ctx.quadraticCurveTo(x, y, x + r, y)
			ctx.closePath()
			ctx.fillstyle = 'orange'
			ctx.fill()
			// ctx.stroke()
		}
	}
}
