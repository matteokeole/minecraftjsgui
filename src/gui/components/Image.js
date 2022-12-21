import Component from "./Component.js";
import {Matrix3, Vector2} from "math";

/**
 * @todo Add image source (WebGLTexture)
 * @todo Summary
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

	this.render = function(gl) {
		this.computePosition();

		const imageSize = this.image.getSizeVector();

		const worldMatrix = Matrix3
			.translation(this.position)
			.scale(this.size);

		const textureMatrix = Matrix3
			.translation(this.uv.divide(imageSize))
			.scale(this.size.divide(imageSize));

		gl.uniformMatrix3fv(gl.uniform.worldMatrix, false, new Float32Array(worldMatrix));
		gl.uniformMatrix3fv(gl.uniform.textureMatrix, false, new Float32Array(textureMatrix));

		gl.bindTexture(gl.TEXTURE_2D, image.source);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
}