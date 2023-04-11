import {WebGLRenderer} from "src";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {Program} from "src/wrappers";

/** @extends WebGLRenderer */
export function InstanceRenderer() {
	WebGLRenderer.call(this, {
		offscreen: false,
		generateMipmaps: false,
	});

	const _build = this.build;
	const attributes = {};
	const buffers = {};
	let gl;

	/**
	 * @override
	 * @param {String} shaderPath
	 * @param {Vector2} screen
	 * @param {Number} compositeCount
	 */
	this.build = async function(shaderPath, screen, compositeCount) {
		_build();

		gl = this.getContext();

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		// gl.enable(gl.BLEND);
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		/** @type {Program} */
		const program = await this.loadProgram("compose.vert", "compose.frag", shaderPath);

		this.linkProgram(program);
		gl.useProgram(program.getProgram());

		attributes.vertex = 0;
		attributes.textureIndex = 1;
		attributes.uv = 2;

		buffers.vertex = gl.createBuffer();
		buffers.textureIndex = gl.createBuffer();
		buffers.uv = gl.createBuffer();

		gl.enableVertexAttribArray(attributes.vertex);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
		gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1, -1,
			 1, -1,
			 1,  1,
			-1,  1,
		]), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(attributes.textureIndex);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureIndex);
		gl.vertexAttribIPointer(attributes.textureIndex, 1, gl.UNSIGNED_BYTE, false, 0, 0);
		gl.vertexAttribDivisor(attributes.textureIndex, 1);

		gl.enableVertexAttribArray(attributes.uv);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
		gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		]), gl.STATIC_DRAW);

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, gl.createTexture());
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, innerWidth, screen.x, screen.y, compositeCount);
	};

	/** @override */
	this.render = function() {
		/** @todo Get the number of canvas textures */

		// gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4);
	};
}

extend(InstanceRenderer, WebGLRenderer);