import {NoWebGL2Error, ShaderCompilationError} from "src/errors";
import Program from "./Program.js";

/**
 * Renderer based on a WebGL context.
 * 
 * @constructor
 * @param {{
 *    offscreen: Boolean,
 *    version: Number,
 * }}
 */
export default function WebGLRenderer({offscreen, version}) {
	if (typeof offscreen !== "boolean") throw TypeError(`The "offscreen" argument must be of type boolean, received ${typeof offscreen}`);
	if (version !== 1 && version !== 2) throw TypeError(`Unrecognized WebGL version: ${version}`);

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

	this.build = function() {
		const
			canvas = offscreen ?
				new OffscreenCanvas(0, 0) :
				document.createElement("canvas"),
			gl = canvas.getContext(version === 2 ? "webgl2" : "webgl");

		if (gl === null) throw new NoWebGL2Error();

		this.canvas = canvas;
		this.gl = gl;
	};

	this.loadProgram = async function(vertexPath, fragmentPath) {
		const
			{gl} = this,
			createShader = async function(path, type) {
				const
					base = "assets/shaders/",
					shader = gl.createShader(type),
					source = await (await fetch(`${base}${path}`)).text();

				gl.shaderSource(shader, source);
				gl.compileShader(shader);

				return shader;
			},
			program = gl.createProgram(),
			vertexShader = await createShader(vertexPath, gl.VERTEX_SHADER),
			fragmentShader = await createShader(fragmentPath, gl.FRAGMENT_SHADER);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);

		return new Program(program, vertexShader, fragmentShader);
	};

	/**
	 * Links a loaded program to the WebGL context.
	 * Returns `true` if the linking ended successfully, `false` otherwise.
	 * 
	 * @param {Program} program
	 * @returns {Boolean}
	 * @throws {ShaderCompilationError}
	 */
	this.linkProgram = function({program, vertexShader, fragmentShader}) {
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
	};

	this.dispose = function() {
		this.gl.getExtension("WEBGL_lose_context").loseContext();

		this.gl = null;
		this.canvas.remove();
		this.canvas = null;
	};
}