import {DynamicComponent} from "src/gui";
import {Vector2} from "src/math";
import {inherits} from "src/utils";
import {textureGenerator as generator} from "../../main.js";

const BUTTON_HEIGHT = 20;

/** @todo Remove name property */
class ButtonWidth {
	constructor({name, width}) {
		this.name = name;
		this.width = width;
	}
}

/**
 * @extends DynamicComponent
 * @param {{
 *    width: Number
 * }}
 */
export default function Button({width, image}) {
	DynamicComponent.apply(this, arguments);

	if (!Number.isInteger(width) || +width < 0) throw TypeError(`Expecting an instance of Number greater than 0, ${width.constructor.name} given`);

	this.setSize(new Vector2(width, BUTTON_HEIGHT));
	this.setUV(new Vector2(0, 0));

	// const texture = generateButtonTexture(width);
	this.setTexture(image);
}

inherits(DynamicComponent, Button);

Button.m = new ButtonWidth({
	name: "m",
	width: 96,
});

Button.l = new ButtonWidth({
	name: "l",
	width: 200,
});

/**
 * @param {Number} width
 * @param {WebGLTexture} baseTexture
 * @returns {OffscreenCanvas}
 */
Button.generateTexture = function(buttonWidth, baseTexture) {
	const viewport = new Vector2(width, 60);

	generator.setViewport(viewport);

	const {canvas, gl} = generator;

	gl.useProgram(generator.programs.button.program);
	gl.uniform2f(generator.uniforms.viewport, viewport.x, viewport.y);
	gl.bindTexture(gl.TEXTURE_2D, baseTexture);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	return canvas;
}