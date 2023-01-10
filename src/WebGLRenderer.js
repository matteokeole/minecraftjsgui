import {ShaderCompilationError} from "src/errors";

/**
 * @todo Summary
 * 
 * @constructor
 * @param {{
 *    offscreen: Boolean,
 *    version: Number,
 * }}
 */
export default function WebGLRenderer({offscreen, version}) {
	/**
	 * @public
	 * @type {undefined|HTMLCanvas|OffscreenCanvas}
	 */
	this.canvas;

	/**
	 * @public
	 * @type {undefined|WebGLRenderingContext|WebGL2RenderingContext}
	 */
	this.gl;

	this.build = function() {};
	this.loadProgram = function() {};
	this.linkProgram = function() {};

	this.dispose = function() {
		const {gl} = this;

		gl.getExtension("WEBGL_lose_context").loseContext();

		this.gl = null;
		this.canvas.remove();
		this.canvas = null;
	};
}