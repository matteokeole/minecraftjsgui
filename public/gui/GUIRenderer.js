import {Matrix3, Vector2} from "src/math";
import WebGLRenderer from "src/renderer";
import TextureWrapper from "../../src/TextureWrapper.js";
import Button from "./components/Button.js";

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

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
		this.#vaos = {
			main: gl.createVertexArray(),
		};

		gl.bindVertexArray(this.#vaos.main);

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
		gl.vertexAttribIPointer(attributes.textureIndex, 1, gl.UNSIGNED_BYTE, false, 0, 0);
		gl.vertexAttribDivisor(attributes.textureIndex, 1);
	}

	async loadTestTextures() {
		const {gl} = this;
		const textureLength = Object.keys(this.textures).length;
		const dimension = 256;
		const imageReplacement = {
			width: dimension,
			height: dimension,
		};
		const canvas = new OffscreenCanvas(dimension, dimension);
		const ctx = canvas.getContext("2d");
		const colors = {
			darkgrey: "#2b2b2b",
			grey: "#6f6f6f",
			overlay: "#000a",
		};
		const colorKeys = Object.keys(colors);

		for (let i = 0, l = colorKeys.length, color; i < l; i++) {
			color = colors[colorKeys[i]];

			ctx.clearRect(0, 0, dimension, dimension);
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, dimension, dimension);

			gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, textureLength + i, dimension, dimension, 1, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

			this.textures[colorKeys[i]] = new TextureWrapper(imageReplacement, textureLength + i);
		}
	}

	loadButtonTextures(widths) {
		const {gl} = this;
		const textureLength = Object.keys(this.textures).length;
		const baseTexture = this.textures["gui/widgets.png"].image;

		for (let i = 0, l = widths.length, image, width; i < l; i++) {
			width = widths[i];
			image = Button.generateTexture(width.width, baseTexture);

			gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, textureLength + i, width.width, 60, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);

			this.textures[`Button.${width.name}`] = width.texture = new TextureWrapper(image, textureLength + i);
		}
	}

	/**
	 * @todo Use camera param?
	 * 
	 * @override
	 */
	render(scene, camera) {
		const
			{gl} = this,
			renderQueueLength = scene.length,
			bufferLength = renderQueueLength * 9,
			worldMatrixData = new Float32Array(bufferLength),
			textureMatrixData = new Float32Array(bufferLength),
			worldMatrices = [],
			textureMatrices = [],
			textureIndices = new Int8Array(renderQueueLength);
		const attributes = this.#attributes;
		const buffers = this.#buffers;

		// Register component world/texture matrices
		for (let i = 0, component; i < renderQueueLength; i++) {
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

			textureIndices[i] = component.getTexture().getIndex();
		}

		// Prepare world matrix buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.worldMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, worldMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup world matrix divisors
		for (let i = 0; i < 3; i++) {
			const loc = attributes.worldMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		// Register component world matrices
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.worldMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, worldMatrixData);

		// Prepare texture matrix buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, textureMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup texture matrix divisors
		for (let i = 0; i < 3; i++) {
			const loc = attributes.textureMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		// Register component texture matrices
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, textureMatrixData);

		// Register component texture indices
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureIndex);
		gl.bufferData(gl.ARRAY_BUFFER, textureIndices, gl.STATIC_DRAW);

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