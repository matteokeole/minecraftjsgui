import {DynamicComponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {gui, textureGenerator as generator} from "../main.js";

const BUTTON_HEIGHT = 20;

/**
 * @deprecated
 * @extends DynamicComponent
 * @param {{
 *    width: ButtonWidth,
 *    disabled: Boolean
 * }}
 */
export default function Button({width, disabled, onMouseEnter: onMouseEnterBase, onMouseLeave: onMouseLeaveBase, onMouseDown: onMouseDownBase}) {
	DynamicComponent.apply(this, arguments);

	this.setTexture(width.texture);
	this.setSize(new Vector2(width.width, BUTTON_HEIGHT));
	this.setUV(new Vector2(0, disabled ? 0 : 20));

	this.setOnMouseEnter(function(p) {
		if (disabled) return;

		onMouseEnterBase?.(p);

		this.setUV(new Vector2(this.getUV().x, 40));

		gui.renderQueue.push(this);
		gui.render();
	});
	this.setOnMouseLeave(function(p) {
		if (disabled) return;

		onMouseLeaveBase?.(p);

		this.setUV(new Vector2(this.getUV().x, 20));

		gui.renderQueue.push(this);
		gui.render();
	});
	this.setOnMouseDown(function(p) {
		if (disabled) return;

		onMouseDownBase?.(p);
	});
}

extend(Button, DynamicComponent);

/** @todo Remove `name` property */
/** @todo Remove `texture` property */
class ButtonWidth {
	constructor({name, width, texture}) {
		this.name = name;
		this.width = width;
		this.texture = texture;
	}
}

Button.m = new ButtonWidth({
	name: "m",
	width: 98,
	texture: null,
});

Button.l = new ButtonWidth({
	name: "l",
	width: 200,
	texture: null,
});

/**
 * @param {Number} width
 * @param {WebGLTexture} baseTexture
 * @returns {OffscreenCanvas}
 */
Button.generateTexture = function(width, baseTexture) {
	const viewport = new Vector2(width, 60);

	generator.setViewport(viewport);

	const {canvas, gl} = generator;

	gl.useProgram(generator.programs.button.program);
	gl.uniform2f(generator.uniforms.viewport, viewport.x, viewport.y);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, baseTexture);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	return canvas;
}