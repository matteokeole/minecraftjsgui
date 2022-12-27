import {Matrix3, Vector2} from "math";
import Renderer from "renderer";
import Instance from "../../src/Instance.js";
import Component from "../../src/gui/components/Component.js";

/**
 * GUI renderer singleton.
 * 
 * @constructor
 * @extends Renderer
 * @param {Instance} instance
 */
export default function GUIRenderer(instance) {
	if (GUIRenderer._instance) return GUIRenderer._instance;

	Renderer.call(this, instance, {
		generateMipmaps: false,
	});

	GUIRenderer._instance = this;

	/**
	 * List of components marked for redraw.
	 * 
	 * @type {Component[]}
	 */
	const componentRenderStack = [];

	function pushToRenderStack() {
		componentRenderStack.push(this);
	};

	/** @type {Set<Component>} */
	this.components = new Set();

	let canvas, gl;

	this.init = async function() {
		canvas = this.getCanvas();
		gl = this.getGL();

		const {currentScale} = this.instance;

		// Load component program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"component.vert",
			"component.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		gl.useProgram(program);

		gl.attribute.position = 0;
		gl.attribute.worldMatrix = 1;
		gl.attribute.textureMatrix = 4;
		gl.attribute.textureIndex = 7;
		gl.uniform.projectionMatrix = gl.getUniformLocation(program, "u_projection");
		gl.buffer.position = gl.createBuffer();
		gl.buffer.worldMatrix = gl.createBuffer();
		gl.buffer.textureMatrix = gl.createBuffer();
		gl.buffer.textureIndex = gl.createBuffer();

		gl.bindVertexArray(gl.vao.main);

		const projectionMatrix = Matrix3
			.projection(new Vector2(canvas.width, canvas.height))
			.scale(new Vector2(currentScale, currentScale));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Enable attributes
		gl.enableVertexAttribArray(gl.attribute.position);
		gl.enableVertexAttribArray(gl.attribute.worldMatrix);
		gl.enableVertexAttribArray(gl.attribute.textureMatrix);
		gl.enableVertexAttribArray(gl.attribute.textureIndex);

		// Set vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		]), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureIndex);
		gl.vertexAttribPointer(gl.attribute.textureIndex, 1, gl.FLOAT, false, 0, 0);
		gl.vertexAttribDivisor(gl.attribute.textureIndex, 1);
	};

	/**
	 * @todo Securize
	 * 
	 * Adds the provided components to the component draw list.
	 * 
	 * @param {...Component} components
	 */
	this.add = function(...components) {
		const {length} = components;
		let component;

		for (let i = 0; i < length; i++) {
			component = components[i];
			component.pushToRenderStack = pushToRenderStack;
			component.pushToRenderStack();

			if (component.onMouseEnter) {
				component.onMouseEnter.component = component;

				this.instance.addMouseEnterListener(component.onMouseEnter);
			}

			if (component.onMouseLeave) {
				component.onMouseLeave.component = component;

				this.instance.addMouseLeaveListener(component.onMouseLeave);
			}

			if (component.onMouseDown) {
				component.onMouseDown.component = component;

				this.instance.addMouseDownListener(component.onMouseDown);
			}

			this.components.add(components[i]);
		}
	};

	this.compute = function() {
		const
			components = [...this.components],
			{length} = components;
		
		for (let i = 0; i < length; i++) {
			components[i].computePosition(this.instance);
		}
	};

	/**
	 * @todo Privatise `gl`
	 * 
	 * Renders the GUI and updates the scene renderer GUI texture.
	 */
	this.render = function() {
		const
			{length} = componentRenderStack,
			worldMatrixData = new Float32Array(length * 9),
			worldMatrices = [],
			textureMatrixData = new Float32Array(length * 9),
			textureMatrices = [];

		// Register component world/texture matrices
		for (let i = 0; i < length; i++) {
			worldMatrices.push(new Float32Array(
				worldMatrixData.buffer,
				i * 36,
				9,
			));

			textureMatrices.push(new Float32Array(
				textureMatrixData.buffer,
				i * 36,
				9,
			));

			const component = componentRenderStack[i];
			const worldMatrix = Matrix3
				.translate(component.position)
				.scale(component.size);
			const textureMatrix = Matrix3
				.translate(component.uv.divide(component.image.size))
				.scale(component.size.divide(component.image.size));

			for (let j = 0; j < 9; j++) {
				worldMatrices[i][j] = worldMatrix[j];
				textureMatrices[i][j] = textureMatrix[j];
			}
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.worldMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, worldMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup world matrix divisors
		for (let i = 0; i < 3; i++) {
			const loc = gl.attribute.worldMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.worldMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, worldMatrixData);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureMatrix);
		gl.bufferData(gl.ARRAY_BUFFER, textureMatrixData.byteLength, gl.DYNAMIC_DRAW);

		// Setup texture matrix divisors
		for (let i = 0; i < 3; i++) {
			const loc = gl.attribute.textureMatrix + i;

			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, i * 12);
			gl.vertexAttribDivisor(loc, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureMatrix);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, textureMatrixData);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.textureIndex);
		const textureIndices = new Float32Array(length);
		for (let i = 0; i < length; i++) textureIndices[i] = componentRenderStack[i].image.index;
		gl.bufferData(gl.ARRAY_BUFFER, textureIndices, gl.STATIC_DRAW);

		// Clear the render stack
		componentRenderStack.length = 0;

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, length);

		this.instance.updateRendererTexture(0, canvas);
	};

	this.resize = function() {
		const {viewportWidth, viewportHeight, currentScale} = this.instance;

		canvas.width = viewportWidth;
		canvas.height = viewportHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		const projectionMatrix = Matrix3
			.projection(new Vector2(canvas.width, canvas.height))
			.scale(new Vector2(currentScale, currentScale));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Register all components
		const
			components = [...this.components],
			{length} = components;

		for (let i = 0; i < length; i++) components[i].pushToRenderStack();

		this.compute();
		this.render();
	};
}

GUIRenderer.prototype = Object.create(Renderer.prototype, {
	constructor: {
		value: GUIRenderer,
	},
});