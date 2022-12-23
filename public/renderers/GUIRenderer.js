import Renderer from "renderer";
import {instance} from "../main.js";
import {Matrix3, Vector2} from "math";
import SceneRenderer from "./SceneRenderer.js";

/**
 * 2D GUI renderer singleton.
 * 
 * @constructor
 * @extends Renderer
 */
function GUIRenderer() {
	if (GUIRenderer._instance) return GUIRenderer._instance;

	Renderer.call(this, {
		offscreen: true,
		generateMipmaps: true,
	});

	GUIRenderer._instance = this;

	/** @type {Set<Component>} */
	this.components = new Set();

	this.init = async function() {
		const {canvas, gl} = this;

		// Load component program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"component.vert",
			"component.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		gl.useProgram(program);

		gl.attribute.position = 0;
		gl.uniform.projectionMatrix = gl.getUniformLocation(program, "u_projectionMatrix");
		gl.uniform.worldMatrix = gl.getUniformLocation(program, "u_worldMatrix");
		gl.uniform.textureMatrix = gl.getUniformLocation(program, "u_textureMatrix");
		gl.buffer.position = gl.createBuffer();

		gl.bindVertexArray(gl.vao.main);

		const projectionMatrix = Matrix3
			.projection(new Vector2(canvas.width, canvas.height))
			.scale(new Vector2(2, 2));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		gl.enableVertexAttribArray(gl.attribute.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		]), gl.STATIC_DRAW);
	};

	/**
	 * Adds the provided components to the component draw list.
	 * 
	 * @param {...Component} components
	 */
	this.add = function(...components) {
		const {length} = components;

		for (let i = 0; i < length; i++) {
			this.components.add(components[i]);
		}
	};

	/**
	 * Removes the provided components from the component draw list.
	 * 
	 * @param {...Component} components
	 */
	this.remove = function(...components) {
		const {length} = components;

		for (let i = 0; i < length; i++) {
			this.components.delete(components[i]);
		}
	};

	/**
	 * Renders the GUI and updates the scene renderer GUI texture.
	 * 
	 * @callback {SceneRenderer~updateGUITexture}
	 */
	this.render = function() {
		const
			components = [...this.components],
			{length} = components;

		for (let i = 0; i < length; i++) {
			components[i].render(this.gl);
		}

		SceneRenderer.updateGUITexture(this.canvas);
	};

	this.resize = function() {
		const
			{canvas, gl} = this,
			{viewportWidth, viewportHeight, currentScale} = instance;

		canvas.width = viewportWidth;
		canvas.height = viewportHeight;

		gl.viewport(0, 0, canvas.width, canvas.height);

		const projectionMatrix = Matrix3
			.projection(new Vector2(canvas.width, canvas.height))
			.scale(new Vector2(currentScale, currentScale));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		this.render();
	};
}

GUIRenderer.prototype = Object.create(Renderer.prototype, {
	constructor: {
		value: GUIRenderer,
	},
});

export default new GUIRenderer();