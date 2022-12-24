import {ShaderCompilationError} from "errors";
import Texture from "./Texture.js";

/**
 * @todo Remove instance import
 * 
 * @constructor
 * @param {Instance} instance
 * @param {object} options
 * @param {boolean} options.generateMipmaps
 */
export default function Renderer(instance, {generateMipmaps}) {
	let request,
		fps = 10,
		interval = 1000 / fps,
		then,
		now,
		diff;

	/** @type {boolean} */
	let enabled = false;

	/** @type {OffscreenCanvas} */
	this.canvas = null;

	/** @type {WebGL2RenderingContext} */
	this.gl = null;

	/** @type {object<string, Texture>} */
	this.textures = {};

	/** @type {boolean} */
	this.isInLoop = false;

	/** @type {boolean} */
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
		const {viewportWidth, viewportHeight} = instance;

		this.canvas = new OffscreenCanvas(viewportWidth, viewportHeight);
		this.gl = this.canvas.getContext("webgl2");

		Object.assign(this.gl, {
			attribute: {},
			buffer: {},
			texture: {},
			uniform: {},
			vao: {
				main: this.gl.createVertexArray(),
			},
		});
	};

	/**
	 * Asynchronous texture loader which uses the instance context.
	 * NOTE: Textures are loaded with the RGB format.
	 * 
	 * @async
	 * @param {...string} paths File paths (relative to *assets/textures/*)
	 */
	this.loadTextures = async function(...paths) {
		const
			{gl} = this,
			{length} = paths,
			base = instance.texturePath;
		let path, image, source;

		for (let i = 0; i < length; i++) {
			path = paths[i];
			(image = new Image()).src = `${base}${path}`;

			try {
				await image.decode();
			} catch (error) {
				continue;
			}

			gl.bindTexture(gl.TEXTURE_2D, source = gl.createTexture());
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // Pixelated effect
			generateMipmaps ?
				gl.generateMipmap(gl.TEXTURE_2D) :
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

			this.textures[path] = new Texture(image, source);
		}
	};

	/**
	 * Creates and returns a WebGLProgram from the provided sources.
	 * 
	 * @async
	 * @param {string} vertexPath
	 * @param {string} fragmentPath
	 * @returns {array}
	 */
	this.createProgram = async function([vertexPath, fragmentPath]) {
		const
			{gl} = this,
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
	 * @param {string} path File path (relative to *assets/shaders*)
	 * @param {number} type Shader type
	 * @returns {WebGLShader}
	 */
	this.createShader = async function(path, type) {
		const
			{gl} = this,
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
		const {gl} = this;

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
	 * Initializes the renderer.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 * @async
	 */
	this.init = null;

	/**
	 * Starts the render loop.
	 */
	this.startLoop = function() {
		then = performance.now();
		this.isInLoop = true;

		this.loop();
	};

	/**
	 * Caller for updates and renders within a render loop.
	 */
	this.loop = function() {
		request = requestAnimationFrame(this.loop);

		diff = (now = performance.now()) - then;

		if (diff > interval) {
			then = now - diff % interval;

			this.render();
		}
	}.bind(this);

	/**
	 * Stops the render loop.
	 */
	this.stopLoop = function() {
		cancelAnimationFrame(request);

		this.isInLoop = false;
	}

	/**
	 * Renders a frame.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 */
	this.render = null;

	/**
	 * Resizes the renderer canvas and the context viewport.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 */
	this.resize = function() {
		const {canvas, gl} = this;
		const {viewportWidth, viewportHeight} = instance;

		canvas.width = viewportWidth;
		canvas.height = viewportHeight;

		gl.viewport(0, 0, canvas.width, canvas.height);
	};

	/**
	 * Destroys the renderer.
	 */
	this.dispose = function() {
		if (this.isInLoop) this.stopLoop();

		/**
		 * @todo Unbind and delete all linked objects (buffers, textures, etc) before this
		 * @see {@link https://registry.khronos.org/webgl/extensions/WEBGL_lose_context}
		 */
		this.gl.getExtension("WEBGL_lose_context").loseContext();
		this.gl = null;

		this.canvas = null;
	};
}