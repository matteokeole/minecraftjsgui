import Component from "./Component.js";
import {Matrix3} from "math";

/**
 * @todo Add image source (WebGLTexture)
 * @todo Summary
 * 
 * @constructor
 * @extends Component
 * @param {object} options
 * @param {Vector2} options.size
 */
export function Image({size}) {
	Component.call(this, ...arguments);

	this.size = size;

	this.render = function(gl) {
		const worldMatrix = Matrix3
			.translation(this.position)
			.scale(this.size);

		gl.uniformMatrix3fv(gl.uniform.worldMatrix, false, new Float32Array(worldMatrix));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
}