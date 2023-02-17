import {Matrix3, Vector2} from "src/math";
import WebGLRenderer from "src/renderer";
import TextureWrapper from "../../src/TextureWrapper.js";

export default class GUIRenderer extends WebGLRenderer {
	/** @type {Object<String, Number>} */
	#attributes;

	/** @type {Object<String, WebGLUniformLocation>} */
	#uniforms;

	/** @type {Object<String, WebGLBuffer>} */
	#buffers;

	/** @type {Object<String, WebGLVertexArrayObject>} */
	#vaos;

	constructor() {
		super({
			offscreen: true,
			generateMipmaps: false,
			version: 2,
		});
	}

	/**
	 * @todo Rework parameters
	 * 
	 * @param {String} shaderPath Instance shader path
	 * @param {Matrix3} projectionMatrix
	 */
	async init(shaderPath, projectionMatrix) {
		const {gl} = this;

		/**
		 * Load component program
		 * 
		 * @type {Program}
		 */
		let program = await this.loadProgram(
			"component.vert",
			"component.frag",
			shaderPath,
		);

		this.linkProgram(program);

		({program} = program);

		gl.useProgram(program);

		const attributes = this.#attributes = {
			position: 0,
			worldMatrix: 1,
			textureMatrix: 4,
			textureIndex: 7,
		};
		const uniforms = this.#uniforms = {
			projectionMatrix: gl.getUniformLocation(program, "u_projection"),
		};
		const buffers = this.#buffers = {
			position: gl.createBuffer(),
			worldMatrix: gl.createBuffer(),
			textureMatrix: gl.createBuffer(),
			textureIndex: gl.createBuffer(),
		};
		const vaos = this.#vaos = {
			main: gl.createVertexArray(),
		};

		gl.bindVertexArray(vaos.main);

	 	gl.uniformMatrix3fv(uniforms.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Enable attributes
		gl.enableVertexAttribArray(attributes.position);
		gl.enableVertexAttribArray(attributes.worldMatrix);
		gl.enableVertexAttribArray(attributes.textureMatrix);
		gl.enableVertexAttribArray(attributes.textureIndex);

		// Set vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		]), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureIndex);
		gl.vertexAttribPointer(attributes.textureIndex, 1, gl.UNSIGNED_BYTE, false, 0, 0);
		gl.vertexAttribDivisor(attributes.textureIndex, 1);
	}

	/**
	 * @param {String[]} paths
	 * @param {String} basePath
	 */
	async loadTestTextures(paths, basePath) {
		await this.loadTextures(paths, basePath);

		const {gl} = this;
		const textureLength = Object.keys(this.textures).length;
		const dimension = 256;
		const canvas = new OffscreenCanvas(dimension, dimension);
		const ctx = canvas.getContext("2d");
		const colors = ["blue", "orange", "yellow"];

		for (let i = 0, l = colors.length, color; i < l; i++) {
			color = colors[i];

			ctx.fillStyle = color;
			ctx.fillRect(0, 0, dimension, dimension);

			gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, textureLength + i, dimension, dimension, 1, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

			this.textures[color] = new TextureWrapper(canvas, textureLength + i);
		}
	}

	/** @override */
	render(scene, camera) {
		const
			{gl} = this,
			renderQueueLength = scene.length,
			bufferLength = renderQueueLength * 9,
			worldMatrixData = new Float32Array(bufferLength),
			worldMatrices = [],
			textureMatrixData = new Float32Array(bufferLength),
			textureMatrices = [];
		const attributes = this.#attributes;
		const buffers = this.#buffers;
		let i = 0, component;

		// Register component world/texture matrices
		for (i = 0; i < renderQueueLength; i++) {
			worldMatrices.push(new Float32Array(
				worldMatrixData.buffer,
				i * 36,
				9,
			));

			textureMatrices.push(new Float32Array(
				textureMatrixData.buffer,
				i * 36,
				9,
			));

			component = scene[i];
			const worldMatrix = component.getWorldMatrix();
			const textureMatrix = component.getTextureMatrix();

			for (let j = 0; j < 9; j++) {
				worldMatrices[i][j] = worldMatrix[j];
				textureMatrices[i][j] = textureMatrix[j];
			}
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.worldMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, worldMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup world matrix divisors
		for (i = 0; i < 3; i++) {
			const loc = attributes.worldMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.worldMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, worldMatrixData);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, textureMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup texture matrix divisors
		for (i = 0; i < 3; i++) {
			const loc = attributes.textureMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, textureMatrixData);

		// Register component texture indices
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureIndex);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Uint8Array(scene.map(component => component.getTextureWrapper().index)),
			gl.STATIC_DRAW,
		);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, renderQueueLength);
	}

	/**
	 * Resizes the renderer viewport and updates the projection matrix uniform.
	 * 
	 * @param {Vector2} viewport
	 * @param {Matrix3} projectionMatrix
	 */
	resize(viewport, projectionMatrix) {
		const {canvas, gl} = this;

		gl.viewport(
			0,
			0,
			canvas.width = viewport.x,
			canvas.height = viewport.y,
		);
	 	gl.uniformMatrix3fv(
	 		this.#uniforms.projectionMatrix,
	 		false,
	 		new Float32Array(projectionMatrix),
	 	);
	}
}