import {Matrix3, Vector2} from "math";
import Renderer from "renderer";
import Instance from "../../src/Instance.js";
import Component from "../../src/gui/components/Component.js";
import {Group} from "gui";

/**
 * @todo Rename `componentRenderStack` to `renderStack`
 * 
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
	 * Component tree.
	 * 
	 * @type {Component[]}
	 */
	const componentTree = [];

	/**
	 * List of components marked for redraw.
	 * 
	 * @type {Component[]}
	 */
	const componentRenderStack = [];

	let canvas, gl;

	this.init = async function() {
		canvas = this.getCanvas();
		gl = this.getContext();

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
	 * @todo Better error handling
	 * 
	 * Populates the component tree.
	 * Replaces the `add` method.
	 * 
	 * @throws {TypeError}
	 */
	this.setComponentTree = function(tree) {
		if (!(tree instanceof Array)) throw TypeError("The provided tree must be an instance of Array.");

		const {length} = tree;

		for (let i = 0, component; i < length; i++) {
			component = tree[i];

			componentTree.push(component);

			component instanceof Group ?
				this.addNewToRenderStack(component) :
				componentRenderStack.push(component);
		}
	};

	this.addNewToRenderStack = function(parent) {
		// This methods only adds `Group` children
		if (!(parent instanceof Group)) return;

		const
			children = parent.getChildren(),
			{length} = children;

		for (let i = 0, component; i < length; i++) {
			component = children[i];

			if (component instanceof Group) {
				this.addNewToRenderStack(component);

				continue;
			}

			componentRenderStack.push(component);
		}
	};

	/**
	 * Stores the provided components.
	 * 
	 * @param {...Component} comps
	 * @deprecated
	 */
	this.add = function(...comps) {
		const {length} = comps;
		let component;

		for (let i = 0; i < length; i++) {
			component = comps[i];

			if (component instanceof Group) {
				component.pushToRenderStack = pushGroupToRenderStack;

				componentTree.push(component);
				this.add(...component.getChildren());

				continue;
			}

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

			componentTree.push(component);
		}
	};

	/**
	 * @todo Set instance viewport size as a `Vector2`?
	 * 
	 * Calculates the absolute position for each component.
	 */
	this.computeTree = function() {
		const
			{instance} = this,
			{length} = componentTree,
			initialPosition = new Vector2(0, 0),
			viewport = new Vector2(
				instance.getViewportWidth(),
				instance.getViewportHeight(),
			).divideScalar(instance.currentScale);

		for (let i = 0; i < length; i++) componentTree[i].computePosition(initialPosition, viewport);
	};

	/**
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
				.translate(component.getPosition())
				.scale(component.getSize());
			const textureMatrix = Matrix3
				.translate(component.getUV().divide(component.getImageSize()))
				.scale(component.getSize().divide(component.getImageSize()));

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
		for (let i = 0; i < length; i++) textureIndices[i] = componentRenderStack[i].getImageIndex();
		gl.bufferData(gl.ARRAY_BUFFER, textureIndices, gl.STATIC_DRAW);

		// Clear the render stack
		componentRenderStack.length = 0;

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, length);

		this.instance.updateRendererTexture(0, canvas);
	};

	/**
	 * @todo Pass the resize data (w/h (+ dpr?)) from the instance
	 */
	this.resize = function() {
		const {currentScale} = this.instance;
		const viewportWidth = this.instance.getViewportWidth();
		const viewportHeight = this.instance.getViewportHeight();

		canvas.width = viewportWidth;
		canvas.height = viewportHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		const projectionMatrix = Matrix3
			.projection(new Vector2(canvas.width, canvas.height))
			.scale(new Vector2(currentScale, currentScale));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Register all components
		const {length} = componentTree;

		for (let i = 0; i < length; i++) componentTree[i].pushToRenderStack();

		this.computeTree();
		this.render();
	};

	function pushToRenderStack() {
		componentRenderStack.push(this);
	};

	function pushGroupToRenderStack() {
		const
			children = this.getChildren(),
			{length} = children;

		for (let i = 0; i < length; i++) children[i].pushToRenderStack();
	}
}

GUIRenderer.prototype = Object.create(Renderer.prototype, {
	constructor: {
		value: GUIRenderer,
	},
});