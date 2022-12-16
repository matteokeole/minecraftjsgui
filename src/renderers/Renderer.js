import {NoWebGL2Error} from "errors";

/**
 * @todo Customize shader compilation error
 * 
 * WebGL2 renderer constructor.
 * 
 * @param {bool} offscreen
 */
export default function({offscreen}) {
	offscreen = !!offscreen;

	let request,
		interval,
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

	this.attribute = {};
	this.uniform = {};
	this.buffer = {};
	this.texture = {};
	this.vao = {};

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

		if (this.gl === null) throw new NoWebGL2Error();

		document.body.appendChild(this.canvas);
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
	 * @throws {Error}
	 */
	this.linkProgram = function(program, vertexShader, fragmentShader) {
		const {gl} = this;

		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) return;

		let log;

		if ((log = gl.getShaderInfoLog(vertexShader)).length !== 0) {
			throw Error(`VERTEX SHADER ${log}`);
		}

		if ((log = gl.getShaderInfoLog(fragmentShader)).length !== 0) {
			throw Error(`FRAGMENT SHADER ${log}`);
		}
	};

	/**
	 * Initializes the renderer.
	 * NOTE: Must be overridden in an instance.
	 * 
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

		loop();
	};

	/**
	 * Stops the render loop.
	 */
	this.stopLoop = () => cancelAnimationFrame(request);

	/**
	 * Caller for updates and renders within a render loop.
	 */
	this.loop = function() {
		request = requestAnimationFrame(loop);

		diff = (now = performance.now()) - then;

		if (diff > interval) {
			then = now - diff % interval;

			render();
		}
	};

	/**
	 * Renders a frame.
	 * NOTE: Must be overridden in an instance.
	 */
	this.render = null;
}