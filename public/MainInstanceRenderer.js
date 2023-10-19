import {WebGLRenderer} from "src";
import {extend} from "src/utils";
import {Program} from "src/wrappers";

/** @extends WebGLRenderer */
export function MainInstanceRenderer() {
	WebGLRenderer.call(this, {offscreen: false});

	const _build = this.build;
	let gl, compositeCount;

	/** @param {Number} value */
	this.setCompositeCount = value => void (compositeCount = value);

	/** @returns {Number} */
	this.getCompositeCount = () => compositeCount;

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
			const program = await this.loadProgram(shaderPath, "composite.vert", "composite.frag");

			this.linkProgram(program);
			gl.useProgram(program.getProgram());
		}

		const attributes = this.getAttributes();
		const buffers = this.getBuffers();
		const textures = this.getTextures();

		attributes.vertex = 0;

		buffers.vertex = gl.createBuffer();

		gl.enableVertexAttribArray(attributes.vertex);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
		gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);

		for (let i = 0; i < compositeCount; i++) {
			gl.bindTexture(gl.TEXTURE_2D, textures[i] = gl.createTexture());
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};

	/**
	 * @param {Number} index
	 * @param {OffscreenCanvas} texture
	 */
	this.updateCompositeTexture = function(index, texture) {
		gl.bindTexture(gl.TEXTURE_2D, this.getTextures()[index]);
		/** @todo Replace by `texStorage2D` (lower memory costs in some implementations, according to {@link https://registry.khronos.org/webgl/specs/latest/2.0/#3.7.6}) */
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
	};

	/** @override */
	this.render = function() {
		for (let i = 0; i < compositeCount; i++) {
			gl.bindTexture(gl.TEXTURE_2D, this.getTextures()[i]);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		}
	};
}

extend(MainInstanceRenderer, WebGLRenderer);