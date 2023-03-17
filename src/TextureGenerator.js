import WebGLRenderer from "./WebGLRenderer.js";

export default class TextureGenerator extends WebGLRenderer {
	/** @type {Object<String, WebGLProgram>} */
	programs;

	/** @type {Object<String, WebGLVertexArrayObject>} */
	vaos;

	/** @type {Object<String, Number>} */
	attributes;

	/** @type {Object<String, WebGLUniformLocation>} */
	uniforms;

	/** @type {Object<String, WebGLBuffer>} */
	buffers;

	constructor() {
		super({
			offscreen: true,
			generateMipmaps: false,
			version: 2,
		});
	}

	async init(shaderPath) {
		const {gl} = this;

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		/** @type {Program} */
		let program = await this.loadProgram(
			"button.vert",
			"button.frag",
			shaderPath,
		);

		this.programs = {
			button: program,
		};

		this.linkProgram(program);

		({program} = program);

		this.vaos = {
			button: gl.createVertexArray(),
		};

		gl.useProgram(program);
		gl.bindVertexArray(this.vaos.button);

		this.attributes = {
			position: 0,
		};

		this.uniforms = {
			viewport: gl.getUniformLocation(program, "u_viewport"),
			sampler: gl.getUniformLocation(program, "u_sampler"),
		};

		this.buffers = {
			position: gl.createBuffer(),
		};

		gl.enableVertexAttribArray(this.attributes.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
		gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		]), gl.STATIC_DRAW);

		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
}