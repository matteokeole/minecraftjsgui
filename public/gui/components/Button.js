import {DynamicComponent} from "src/gui";
import {Vector2} from "src/math";
import {inherits} from "src/utils";
import {textureGenerator as generator} from "../../main.js";

const BUTTON_HEIGHT = 20;

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

function generateButtonTexture({width}) {
	const viewport = new Vector2(width, 60);

	generator.setViewport(viewport);

	const {gl} = generator;

	gl.useProgram(generator.programs.button);
	gl.uniform2f(generator.uniforms.viewport, viewport.x, viewport.y);
	gl.bindTexture(gl.TEXTURE_2D, generator.textures["gui/widgets.png"].texture);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}