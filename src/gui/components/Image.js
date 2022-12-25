import Component from "./Component.js";
import {Matrix3, Vector2} from "math";

/**
 * Image component.
 * Stores a pre-loaded `WebGLTexture` and render a rectangular part of it.
 * 
 * @constructor
 * @extends Component
 * @param {object} options
 * @param {Texture} options.image
 * @param {Vector2} options.uv
 */
export default function Image({image, uv}) {
	Component.apply(this, arguments);

	/** @type {Texture} */
	this.image = image;

	/** @type {Vector2} */
	this.uv = uv;

	/** @override */
	this.render = function(gl) {
		const
			worldMatrix = Matrix3
				.translate(this.position)
				.scale(this.size),
			imageSize = this.image.size,
			textureMatrix = Matrix3
				.translate(this.uv.divide(imageSize))
				.scale(this.size.divide(imageSize));

		gl.uniformMatrix3fv(gl.uniform.worldMatrix, false, new Float32Array(worldMatrix));
		gl.uniformMatrix3fv(gl.uniform.textureMatrix, false, new Float32Array(textureMatrix));
		gl.bindTexture(gl.TEXTURE_2D, image.source);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
}