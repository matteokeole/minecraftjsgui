import Component from "./Component.js";

export function Image() {
	Component.call(this, ...arguments);

	this.register = function(gl) {
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1,  1,
		   -1,  1,
		   -1, -1,
			1, -1,
		]), gl.STATIC_DRAW);

		gl.uniform4fv(gl.uniform.color, new Float32Array([1, .2, 0, 1]));
	};
}