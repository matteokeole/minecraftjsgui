import {NoWebGL2Error, ShaderCompilationError} from "errors";

/**
 * @todo Customize shader compilation error
 * 
 * @param {bool} offscreen
 */
export default function Renderer({offscreen}) {
	offscreen = !!offscreen;

	let request,
		interval = 1000 / 10,
		then,
		now,
		diff;

	/**
	 * @type {HTMLCanvasElement|OffscreenCanvas}
	 */
	this.canvas = null;

	/**
	 * @type {WebGL2RenderingContext}
	 */
	this.gl = null;

	/**
	 * Creates the canvas element for this renderer.
	 * 
	 * @throws {NoWebGL2Error}
	 */
	this.build = function() {
		this.canvas = offscreen ?
			new OffscreenCanvas(1, 1) :
			document.createElement("canvas");

		this.gl = this.canvas.getContext("webgl2");
		this.gl.program = {};
		this.gl.attribute = {};
		this.gl.uniform = {};
		this.gl.buffer = {};
		this.gl.texture = {};
		this.gl.vao = {};

		if (this.gl === null) throw new NoWebGL2Error();

		if (!offscreen) document.body.appendChild(this.canvas);
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
	 * @param {string} path
	 * @param {number} type
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