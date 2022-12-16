import Renderer from "./Renderer.js";

/**
 * Scene 2D/3D renderer.
 */
export default new function SceneRenderer() {
	Renderer.call(this, {
		offscreen: false,
	});

	this.init = async function() {
		const {gl} = this;

		// Context configuration
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Load GUI program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"gui.vert",
			"gui.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		this.attribute.position = 0;
		this.uniform.resolution = null;
		this.buffer.position = gl.createBuffer();
		this.texture.gui = gl.createTexture();
		this.vao.main = gl.createVertexArray();

		gl.bindVertexArray(this.vao.main);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);

		gl.bindTexture(gl.TEXTURE_2D, this.texture.gui);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Don't generate mipmaps for the GUI texture

		gl.bindVertexArray(null);
	};

	/**
	 * @param {Scene} scene
	 * @param {Camera} camera
	 */
	this.render = function(scene, camera) {
		const {gl} = this;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindVertexArray(this.vao.main);

		// Draw GUI texture
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1,  1,
		   -1,  1,
		   -1, -1,
			1, -1,
		]), gl.STATIC_DRAW);

		gl.bindTexture(gl.TEXTURE_2D, this.texture.gui);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
};