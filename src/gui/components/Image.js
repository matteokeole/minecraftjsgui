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

	/** @type {Vector2} */
	this.size = size;

	this.render = function(gl) {
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			.9,  .9,
		   -.9,  .9,
		   -.9, -.9,
			.9, -.9,
		]), gl.STATIC_DRAW);

		gl.uniform4fv(gl.uniform.color, new Float32Array([1, .2, 0, 1]));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
}