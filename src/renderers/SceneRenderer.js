import Renderer from "./Renderer.js";

export default new function SceneRenderer() {
	Renderer.call(this, {
		offscreen: false,
		generateMipmaps: true,
	});

	this.init = async function() {
		const {canvas, gl} = this;

		/**
		 * @todo Test code, replace with the ResizeObserver of SceneRenderer
		 */
		{
			canvas.width = innerWidth;
			canvas.height = innerHeight;
		}

		// Context configuration
		gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
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

		gl.attribute.position = 0;
		gl.buffer.position = gl.createBuffer();
		gl.texture.gui = gl.createTexture();

		gl.bindVertexArray(gl.vao.main);

		gl.enableVertexAttribArray(gl.attribute.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);

		// GUI texture vertices
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1,  1,
		   -1,  1,
		   -1, -1,
			1, -1,
		]), gl.STATIC_DRAW);

		// GUI texture configuration
		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Don't generate mipmaps
	};

	this.render = function() {
		const {gl} = this;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};

	/**
	 * Updates the GUI texture with the contents of the provided canvas.
	 * 
	 * @param {OffscreenCanvas} canvas
	 */
	this.updateGUITexture = function(canvas) {
		const {gl} = this;

		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	};
}