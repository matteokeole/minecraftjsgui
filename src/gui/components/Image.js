import Component from "./Component.js";

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
		const matrix = gl.projectionMatrix
			.translate(this.position)
			.scale(this.size);

		gl.uniformMatrix3fv(gl.uniform.matrix, false, new Float32Array(matrix));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
}