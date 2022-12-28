import {ShaderCompilationError} from "errors";
import TextureWrapper from "./TextureWrapper.js";

/**
 * Offscreen renderer.
 * 
 * @constructor
 * @param {Instance} instance
 * @param {{
 *    generateMipmaps: Boolean
 * }}
 */
export default function Renderer(instance, {generateMipmaps}) {
	/** @type {?OffscreenCanvas} */
	let canvas;

	/** @type {?WebGL2RenderingContext} */
	let gl;

	/** @type {Boolean} */
	let enabled = false;

	/**
	 * @type {Object<string, TextureWrapper>}
	 */
	const textures = {};

	/** @type {Boolean} */
	this.disabled = !enabled;

	/**
	 * Enables this renderer.
	 */
	this.enable = function() {
		enabled = true;

		this.disabled = false;
	};

	/**
	 * Disables this renderer.
	 */
	this.disable = function() {
		enabled = false;

		this.disabled = true;
	};

	/**
	 * Initializes the canvas element and its WebGL context.
	 */
	this.build = function() {
		const viewportWidth = instance.getViewportWidth();
		const viewportHeight = instance.getViewportHeight();

		canvas = new OffscreenCanvas(viewportWidth, viewportHeight);
		gl = canvas.getContext("webgl2");

		Object.assign(gl, {
			attribute: {},
			buffer: {},
			texture: {},
			uniform: {},
			vao: {},
		});
	};

	/**
	 * Creates and returns a WebGLProgram from the provided sources.
	 * 
	 * @async
	 * @param {String} vertexPath
	 * @param {String} fragmentPath
	 * @returns {Array}
	 */
	this.createProgram = async function([vertexPath, fragmentPath]) {
		const
			program = gl.createProgram(),
			vertexShader = await this.createShader(vertexPath, gl.VERTEX_SHADER),
			fragmentShader = await this.createShader(fragmentPath, gl.FRAGMENT_SHADER);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		return [program, vertexShader, fragmentShader];
	};

	/**
	 * Creates, compiles and returns a WebGLShader.
	 * 
	 * @async
	 * @param {String} path File path
	 * @param {Number} type Shader type
	 * @returns {WebGLShader}
	 */
	this.createShader = async function(path, type) {
		const
			base = instance.shaderPath,
			shader = gl.createShader(type),
			source = await (await fetch(`${base}${path}`)).text();

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		return shader;
	};

	/**
	 * Links a WebGLProgram to the renderer context.
	 * 
	 * @param {WebGLProgram} program
	 * @param {WebGLShader} vertexShader
	 * @param {WebGLShader} fragmentShader
	 * @throws {ShaderCompilationError}
	 */
	this.linkProgram = function(program, vertexShader, fragmentShader) {
		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) return;

		let log;

		if ((log = gl.getShaderInfoLog(vertexShader)).length !== 0) {
			throw ShaderCompilationError(log, gl.VERTEX_SHADER);
		}

		if ((log = gl.getShaderInfoLog(fragmentShader)).length !== 0) {
			throw ShaderCompilationError(log, gl.FRAGMENT_SHADER);
		}
	};

	/**
	 * Asynchronous texture loader.
	 * Textures are loaded as 256x256 texture array layers.
	 * 
	 * @async
	 * @param {...String} paths
	 */
	this.loadTextures = async function(...paths) {
		const
			{length} = paths,
			base = instance.texturePath,
			image = new Image();

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, gl.createTexture());
		gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 8, gl.RGBA8, 256, 256, length);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // Pixelated effect
		generateMipmaps ?
			gl.generateMipmap(gl.TEXTURE_2D_ARRAY) :
			gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		for (let i = 0, path, source; i < length; i++) {
			path = paths[i];
			image.src = `${base}${path}`;

			try {
				await image.decode();
			} catch (error) {
				continue;
			}

			gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, 256, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);

			textures[path] = new TextureWrapper(source, image, i);
		}
	};

	/**
	 * @param {String} path
	 */
	this.getTexture = path => textures[path];

	/**
	 * Initializes the renderer.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 * @async
	 */
	this.init = null;

	/**
	 * Renders a frame.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 */
	this.render = null;

	/**
	 * Destroys all the context/canvas data.
	 * Called by the parent instance.
	 */
	this.dispose = function() {
		/**
		 * @todo Unbind and delete all linked objects (buffers, textures, etc) before this
		 * @see {@link https://registry.khronos.org/webgl/extensions/WEBGL_lose_context}
		 */
		// gl.deleteTexture(texture);
		// gl.deleteBuffer(buffer);
		// gl.deleteVertexArray(vao);
		// gl.deleteShader(shader);
		// gl.deleteProgram(program);
		gl.getExtension("WEBGL_lose_context").loseContext();
		gl = null;

		canvas = null;
	};

	this.getCanvas = () => canvas;

	this.getContext = () => gl;
}