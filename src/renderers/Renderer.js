import {NoWebGL2Error, ShaderCompilationError} from "errors";

/**
 * @todo Summary
 * 
 * @constructor
 * @abstract
 * @param {object} options
 * @param {boolean} options.offscreen
 * @param {boolean} options.generateMipmaps
 */
export default function Renderer({offscreen, generateMipmaps}) {
	let request,
		interval = 1000 / 10,
		then,
		now,
		diff;

	/** @type {HTMLCanvasElement|OffscreenCanvas} */
	this.canvas = null;

	/** @type {WebGL2RenderingContext} */
	this.gl = null;

	/**
	 * Creates the canvas element for this renderer.
	 * 
	 * @throws {NoWebGL2Error}
	 */
	this.build = function() {
		const canvas = offscreen ?
			/**
			 * @todo Test code, replace with the ResizeObserver of SceneRenderer
			 */
			new OffscreenCanvas(innerWidth, innerHeight) :
			document.createElement("canvas");

		const gl = canvas.getContext("webgl2");

		if (gl === null) throw new NoWebGL2Error();

		gl.attribute = {};
		gl.uniform = {};
		gl.buffer = {};
		gl.texture = {};
		gl.vao = {
			main: gl.createVertexArray(),
		};

		if (!offscreen) document.body.appendChild(canvas);

		this.canvas = canvas;
		this.gl = gl;
	};

	/**
	 * @todo Remove hard-coded base path
	 * 
	 * Asynchronous texture loader which uses the instance context.
	 * NOTE: Textures are loaded with the RGB format.
	 * 
	 * @async
	 * @param {...string} paths File paths (relative to *assets/textures/*)
	 */
	this.loadTextures = async function(...paths) {
		const {gl} = this;
		const {length} = paths;
		let path, image, texture;

		for (let i = 0; i < length; i++) {
			path = paths[i];
			(image = new Image()).src = `assets/textures/${path}`;

			try {
				await image.decode();
			} catch (error) {
				continue;
			}

			gl.bindTexture(gl.TEXTURE_2D, texture = gl.createTexture());
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // Pixelated effect
			generateMipmaps ?
				gl.generateMipmap(gl.TEXTURE_2D) :
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

			gl.texture[path] = texture;
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
	 * @todo Remove hard-coded base path
	 * 
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
			shader = gl.createShader(type),
			source = await (await fetch(`assets/shaders/${path}`)).text();

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
	 * 
	 * @callback {loop}
	 */
	this.startLoop = function() {
		then = performance.now();

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
	this.stopLoop = () => cancelAnimationFrame(request);

	/**
	 * Renders a frame.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 */
	this.render = null;

	/**
	 * Destroys the renderer.
	 */
	this.dispose = function() {
		this.stopLoop();

		this.gl = null;

		if (!offscreen) {
			this.canvas.remove();
		}

		this.canvas = null;
	};
}