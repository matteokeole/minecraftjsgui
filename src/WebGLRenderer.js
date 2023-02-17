import {NotImplementedError, NoWebGL2Error, ShaderCompilationError} from "src/errors";
import {Vector2} from "src/math";
import Program from "./Program.js";
import TextureWrapper from "./TextureWrapper.js";

/**
 * General-purpose renderer based on a WebGL context.
 */
export default class WebGLRenderer {
	/** @type {Boolean} */
	#offscreen;

	/** @type {Boolean} */
	#generateMipmaps;

	/** @type {Number} */
	#version;

	/**
	 * @param {{
	 *    offscreen: Boolean,
	 *    generateMipmaps: Boolean,
	 *    version: Number,
	 * }}
	 */
	constructor({offscreen, generateMipmaps, version}) {
		if (typeof offscreen !== "boolean") throw TypeError(`The "offscreen" argument must be of type boolean, received ${typeof offscreen}`);
		if (typeof generateMipmaps !== "boolean") throw TypeError(`The "generateMipmaps" argument must be of type boolean, received ${typeof generateMipmaps}`);
		if (version !== 1 && version !== 2) throw TypeError(`Unrecognized WebGL version: ${version}`);

		this.#offscreen = offscreen;
		this.#generateMipmaps = generateMipmaps;
		this.#version = version;

		/**
		 * @public
		 * @type {HTMLCanvasElement|OffscreenCanvas|null}
		 */
		this.canvas = null;

		/**
		 * @public
		 * @type {WebGLRenderingContext|WebGL2RenderingContext|null}
		 */
		this.gl = null;

		/**
		 * @public
		 * @type {Object<String, TextureWrapper>}
		 */
		this.textures = {};
	}

	build() {
		const
			canvas = this.#offscreen ? new OffscreenCanvas(0, 0) : document.createElement("canvas"),
			gl = canvas.getContext(this.#version === 2 ? "webgl2" : "webgl");

		if (gl === null) throw new NoWebGL2Error();

		this.canvas = canvas;

		gl.attribute = {};
		gl.buffer = {};
		gl.texture = {};
		gl.uniform = {};
		gl.vao = {};

		this.gl = gl;
	}

	/**
	 * @todo Set viewport size as multiples of 2 to avoid subpixel artifacts?
	 * 
	 * @param {Vector2} viewport
	 * @returns {Vector2}
	 */
	setViewport(viewport) {
		this.gl.viewport(
			0,
			0,
			this.canvas.width = viewport.x,
			this.canvas.height = viewport.y,
		);

		return viewport;
	}

	async loadProgram(vertexPath, fragmentPath, basePath) {
		const
			{gl} = this,
			createShader = async function(path, type) {
				const
					shader = gl.createShader(type),
					source = await (await fetch(path)).text();

				gl.shaderSource(shader, source);
				gl.compileShader(shader);

				return shader;
			},
			program = gl.createProgram(),
			vertexShader = await createShader(`${basePath}${vertexPath}`, gl.VERTEX_SHADER),
			fragmentShader = await createShader(`${basePath}${fragmentPath}`, gl.FRAGMENT_SHADER);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);

		return new Program(program, vertexShader, fragmentShader);
	}

	/**
	 * Links a loaded program to the WebGL context.
	 * Returns `true` if the linking ended successfully, `false` otherwise.
	 * 
	 * @param {Program} program
	 * @returns {Boolean}
	 * @throws {ShaderCompilationError}
	 */
	linkProgram({program, vertexShader, fragmentShader}) {
		const {gl} = this;

		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) return true;

		let log;

		if ((log = gl.getShaderInfoLog(vertexShader)).length !== 0) {
			throw new ShaderCompilationError(log, gl.VERTEX_SHADER);
		}

		if ((log = gl.getShaderInfoLog(fragmentShader)).length !== 0) {
			throw new ShaderCompilationError(log, gl.FRAGMENT_SHADER);
		}

		return false;
	}

	/**
	 * @todo Test with `gl.RGB` color format
	 * 
	 * Asynchronous texture loader.
	 * Loads a serie of sources in a `WebGLTexture` array.
	 * The array dimensions are 256x256 and a pixelated filter is applied.
	 * Uses `gl.RGBA` color format.
	 * 
	 * @param {String[]} paths
	 * @param {String} basePath
	 */
	async loadTextures(paths, basePath) {
		const {gl} = this;
		const {length} = paths;

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, gl.createTexture());
		gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 8, gl.RGBA8, 256, 256, length + 3);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		this.#generateMipmaps ?
			gl.generateMipmap(gl.TEXTURE_2D_ARRAY) :
			gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		const image = new Image();

		for (let i = 0, path; i < length; i++) {
			path = paths[i];
			image.src = `${basePath}${path}`;

			try {
				await image.decode();
			} catch (error) {
				/** @todo Default texture for invalid paths? */
				continue;
			}

			gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, 256, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);

			this.textures[path] = new TextureWrapper(image, i);
		}
	}

	/**
	 * @param {Array} scene
	 * @param {Camera} camera
	 */
	render(scene, camera) {
		throw new NotImplementedError();
	}

	clear() {
		const {gl} = this;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	/**
	 * @todo Unbind and delete all linked objects (buffers, textures, etc)
	 * @see {@link https://registry.khronos.org/webgl/extensions/WEBGL_lose_context}
	 */
	dispose() {
		// this.gl.deleteTexture(texture);
		// this.gl.deleteBuffer(buffer);
		// this.gl.deleteVertexArray(vao);
		// this.gl.deleteShader(shader);
		// this.gl.deleteProgram(program);
		this.gl.getExtension("WEBGL_lose_context").loseContext();

		this.gl = null;
		this.canvas.remove();
		this.canvas = null;
	}
}