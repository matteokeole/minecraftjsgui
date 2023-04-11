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
	const textures = [];
	let gl, compositeCount;

	/** @param {Number} value */
	this.setCompositeCount = value => void (compositeCount = value);

	/**
	 * @override
	 * @param {String} shaderPath
	 */
	this.build = async function(shaderPath) {
		_build();

		gl = this.getContext();
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		{
			/** @type {Program} */
			const program = await this.loadProgram("compose.vert", "compose.frag", shaderPath);

			this.linkProgram(program);
			gl.useProgram(program.getProgram());
		}

		attributes.vertex = 0;
		attributes.uv = 1;

		buffers.vertex = gl.createBuffer();
		buffers.uv = gl.createBuffer();

		gl.enableVertexAttribArray(attributes.vertex);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
		gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, false, 0, 0);
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(attributes.uv);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
		gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, false, 0, 0);
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 0, 0, 1, 0]), gl.STATIC_DRAW);

		for (let i = 0, texture; i < compositeCount; i++) {
			textures.push(texture = gl.createTexture());

			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};

	/**
	 * @param {Number} index
	 * @param {OffscreenCanvas} texture
	 */
	this.setTexture = function(index, texture) {
		gl.bindTexture(gl.TEXTURE_2D, textures[index]);
		/** @todo Replace by `texStorage2D` (lower memory costs in some implementations, according to {@link https://registry.khronos.org/webgl/specs/latest/2.0/#3.7.6}) */
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture);
	};

	/** @override */
	this.render = function() {
		for (let i = 0; i < compositeCount; i++) {
			gl.bindTexture(gl.TEXTURE_2D, textures[i]);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		}
	};
}

extend(InstanceRenderer, WebGLRenderer);