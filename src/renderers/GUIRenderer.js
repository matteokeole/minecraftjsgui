import Renderer from "./Renderer.js";

/**
 * 2D GUI renderer.
 */
export default new function GUIRenderer() {
	Renderer.call(this, {
		offscreen: true,
	});

	this.meshes = new Set();

	this.init = async function() {
		const {gl} = this;

		// Context configuration
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Load component program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"component.vert",
			"component.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		this.attribute.position = 0;
		this.uniform.resolution = gl.getUniformLocation(program, "u_resolution");
		this.buffer.position = gl.createBuffer();
		this.texture.gui = gl.createTexture();

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
	};

	this.addMesh = function(mesh) {
		this.meshes.add(mesh);
	};

	this.render = function() {
		const
			{gl} = this,
			meshes = [...this.meshes],
			{length} = meshes;

		for (let i = 0; i < length; i++) {
			meshes[i].render(gl);
		}
	};
}