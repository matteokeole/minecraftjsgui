import {Matrix3, Vector2} from "../math/index.js";
import WebGLRenderer from "../WebGLRenderer.js";
import Texture from "../Texture.js";

/**
 * @todo Convert to function constructor
 */
export class GUIRenderer extends WebGLRenderer {
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
			"subcomponent.vert",
			"subcomponent.frag",
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

			this.textures[colorKeys[i]] = new Texture(imageReplacement, textureLength + i);
		}
	}

	/**
	 * @todo Optimize the subcomponent part
	 * @todo Use `camera` param?
	 * 
	 * @override
	 */
	render(scene, camera) {
		const {gl} = this,
			componentCount = scene.length,
			bufferLength = componentCount * 9,
			worldMatrices = new Float32Array(bufferLength),
			textureMatrices = new Float32Array(bufferLength),
			textureIndices = new Uint8Array(componentCount);
		let i = 0, loc;

		const subcomponentWorldMatrices = [];
		const subcomponentTextureMatrices = [];
		const subcomponentTextureIndices = [];
		let subcomponentCount = 0;

		for (let component; i < componentCount; i++) {
			component = scene[i];

			const subcomponents = component.getSubcomponents();
			let subcomponent, l = subcomponents.length;
			subcomponentCount += l;

			for (let j = 0; j < l; j++) {
				subcomponent = subcomponents[j];

				const position = component.getPosition()
					.clone()
					.add(subcomponent.getOffset());

				// World matrix
				subcomponentWorldMatrices.push(
					...Matrix3
						.translate(position)
						.scale(subcomponent.getSize())
				);

				// Texture matrix
				subcomponentTextureMatrices.push(
					...Matrix3
						.translate(subcomponent.getUV().divide(new Vector2(256, 256)))
						.scale(subcomponent.getSize().divide(new Vector2(256, 256)))
				);

				subcomponentTextureIndices.push(component.getTexture().getIndex());
			}
		}

		/* for (let j = 0, component; i < componentCount; i++, j += 9) {
			component = scene[i];

			worldMatrices.set(component.getWorldMatrix(), j);
			textureMatrices.set(component.getTextureMatrix(), j);
			textureIndices[i] = component.getTexture().getIndex();
		} */

		// Register world matrices
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffers.worldMatrix);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(subcomponentWorldMatrices), gl.STATIC_DRAW);

			for (i = 0; i < 3; i++) {
				gl.enableVertexAttribArray(loc = this.#attributes.worldMatrix + i);
				gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
				gl.vertexAttribDivisor(loc, 1);
			}
		}

		// Register texture matrices
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffers.textureMatrix);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(subcomponentTextureMatrices), gl.STATIC_DRAW);

			for (i = 0; i < 3; i++) {
				gl.enableVertexAttribArray(loc = this.#attributes.textureMatrix + i);
				gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
				gl.vertexAttribDivisor(loc, 1);
			}
		}

		// Register texture indices
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffers.textureIndex);
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(subcomponentTextureIndices), gl.STATIC_DRAW);

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, subcomponentCount);
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