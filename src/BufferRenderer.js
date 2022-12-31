import {ShaderCompilationError} from "src/errors";

/**
 * @todo Remove duplicate methods!
 */
export default function BufferRenderer(instance) {
	/** @type {OffscreenCanvas} */
	let canvas;

	/** @type {WebGL2RenderingContext} */
	let gl;

	this.prepare = async function() {
		canvas = new OffscreenCanvas(0, 0);
		gl = canvas.getContext("webgl2");

		const program = await createProgram(instance.shaderPath, [
			"bufferRenderer.vert",
			"bufferRenderer.frag",
		]);

		linkProgram(...program);
	};

	/**
	 * @param {Component} component
	 */
	this.cacheComponentTexture = function(component) {
		//
	};

	this.resizeToComponentSize = size => void gl.viewport(0, 0, canvas.width = size.x, canvas.height = size.y);

	/** @todo Remove duplicate util */
	async function createProgram(basePath, [vertexPath, fragmentPath]) {
		const
			program = gl.createProgram(),
			vertexShader = await createShader(basePath, vertexPath, gl.VERTEX_SHADER),
			fragmentShader = await createShader(basePath, fragmentPath, gl.FRAGMENT_SHADER);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		return [program, vertexShader, fragmentShader];
	}

	/** @todo Remove duplicate util */
	async function createShader(base, path, type) {
		const
			shader = gl.createShader(type),
			source = await (await fetch(`${base}${path}`)).text();

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		return shader;
	}

	/** @todo Remove duplicate util */
	function linkProgram(program, vertexShader, fragmentShader) {
		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) return;

		let log;

		if ((log = gl.getShaderInfoLog(vertexShader)).length !== 0) {
			throw ShaderCompilationError(log, gl.VERTEX_SHADER);
		}

		if ((log = gl.getShaderInfoLog(fragmentShader)).length !== 0) {
			throw ShaderCompilationError(log, gl.FRAGMENT_SHADER);
		}
	}
}