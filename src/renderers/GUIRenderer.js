import Renderer from "./Renderer.js";

export default new function GUIRenderer() {
	Renderer.call(this, {
		offscreen: true,
	});

	this.meshes = new Set();

	this.init = async function() {
		/**
		 * @todo Test code, replace with the ResizeObserver of SceneRenderer
		 */
		 {
			const {canvas, gl} = this;

			canvas.width = innerWidth;
			canvas.height = innerHeight;
	
			gl.viewport(0, 0, canvas.width, canvas.height);
		}

		const {gl} = this;

		// Context configuration
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Load component program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"component.vert",
			"component.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		gl.useProgram(program);

		gl.attribute.position = 0;
		gl.uniform.color = gl.getUniformLocation(program, "u_color");
		gl.uniform.resolution = gl.getUniformLocation(program, "u_resolution");
		gl.buffer.position = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
	};

	this.addMesh = function(mesh) {
		this.meshes.add(mesh);
	};

	/**
	 * Renders the GUI and updates the scene renderer GUI texture.
	 * 
	 * @callback {SceneRenderer~updateGUITexture}
	 */
	this.render = function() {
		const
			{gl} = this,
			meshes = [...this.meshes],
			{length} = meshes;

		for (let i = 0; i < length; i++) {
			meshes[i].register(gl);
		}

		// gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

		gl.clearColor(1, .2, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
	};
}