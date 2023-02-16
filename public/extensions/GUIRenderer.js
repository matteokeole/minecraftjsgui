import {Matrix3, Vector2} from "src/math";
import TextureWrapper from "../../src/TextureWrapper.js";
import WebGLRenderer from "../../src/WebGLRenderer.js";

/**
 * @extends WebGLRenderer
 */
export default class GUIRenderer extends WebGLRenderer {
	constructor() {
		super({
			offscreen: true,
			generateMipmaps: false,
			version: 2,
		});
	}

	async init(shaderPath, projectionMatrix) {
		const {gl} = this;

		/** @type {Program} */
		let program = await this.loadProgram(
			"component.vert",
			"component.frag",
			shaderPath,
		);

		this.linkProgram(program);

		// Program shaders won't be used anymore, remove access to them
		({program} = program);

		gl.useProgram(program);

		gl.attribute = {
			position: 0,
			worldMatrix: 1,
			textureMatrix: 4,
			textureIndex: 7,
		};
		gl.uniform = {
			projectionMatrix: gl.getUniformLocation(program, "u_projection"),
		};
		gl.buffer = {
			position: gl.createBuffer(),
			worldMatrix: gl.createBuffer(),
			textureMatrix: gl.createBuffer(),
			textureIndex: gl.createBuffer(),
		};
		gl.vao = {
			main: gl.createVertexArray(),
		};

		gl.bindVertexArray(gl.vao.main);

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Enable attributes
		gl.enableVertexAttribArray(gl.attribute.position);
		gl.enableVertexAttribArray(gl.attribute.worldMatrix);
		gl.enableVertexAttribArray(gl.attribute.textureMatrix);
		gl.enableVertexAttribArray(gl.attribute.textureIndex);

		// Set vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		]), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureIndex);
		gl.vertexAttribPointer(gl.attribute.textureIndex, 1, gl.FLOAT, false, 0, 0);
		gl.vertexAttribDivisor(gl.attribute.textureIndex, 1);
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

	/**
	 * @todo Use the camera parameter
	 * 
	 * Renders a GUI frame and updates the output texture.
	 * The instance is required to update the output renderer texture.
	 */
	render(scene, camera) {
		const
			{gl} = this,
			queueLength = scene.length,
			bufferLength = queueLength * 9,
			worldMatrixData = new Float32Array(bufferLength),
			worldMatrices = [],
			textureMatrixData = new Float32Array(bufferLength),
			textureMatrices = [];

		// Register component world/texture matrices
		for (let i = 0, component; i < queueLength; i++) {
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

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.worldMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, worldMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup world matrix divisors
		for (let i = 0; i < 3; i++) {
			const loc = gl.attribute.worldMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.worldMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, worldMatrixData);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, textureMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup texture matrix divisors
		for (let i = 0; i < 3; i++) {
			const loc = gl.attribute.textureMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, textureMatrixData);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureIndex);
		const textureIndices = new Float32Array(queueLength);
		for (let i = 0; i < queueLength; i++) textureIndices[i] = scene[i].getTextureWrapper().index;
		gl.bufferData(gl.ARRAY_BUFFER, textureIndices, gl.STATIC_DRAW);

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, queueLength);
	}

	/**
	 * @todo Must override `WebGLRenderer.resize`
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

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));
	}
}