import Renderer from "./Renderer.js";

export default new function SceneRenderer() {
	Renderer.call(this, {offscreen: false});

	this.init = async function() {
		const {gl} = this;

		// Context configuration
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // For GUI transparency

		// Load GUI program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"gui.vert",
			"gui.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		gl.useProgram(program);

		gl.program.gui = program;
		gl.attribute.position = 0;
		gl.buffer.position = gl.createBuffer();
		gl.texture.gui = gl.createTexture();
		gl.vao.main = gl.createVertexArray();

		gl.bindVertexArray(gl.vao.main);

		gl.enableVertexAttribArray(gl.attribute.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);

		// GUI texture configuration
		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Don't generate mipmaps

		// GUI texture vertices
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1,  1,
		   -1,  1,
		   -1, -1,
			1, -1,
		]), gl.STATIC_DRAW);

		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};

	/**
	 * @param {Scene} scene
	 * @param {Camera} camera
	 */
	this.render = function(scene, camera) {
		const {gl} = this;

		// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// gl.useProgram(gl.program.gui);
		// gl.bindVertexArray(gl.vao.gui);

		// gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};

	/**
	 * Updates the GUI texture with the contents of the provided canvas.
	 * 
	 * @param {OffScreenCanvas} canvas
	 */
	this.updateGUITexture = function(canvas) {
		const {gl} = this;

		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	};
}