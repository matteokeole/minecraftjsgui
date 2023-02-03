import {Matrix3, Vector2} from "src/math";
import Renderer from "src/renderer";
import Component from "../../src/gui/components/Component.js";
import {Button, Group} from "src/gui";
import BufferRenderer from "src/buffer-renderer";
import WebGLRenderer from "../../src/WebGLRenderer.js";

/**
 * GUI renderer.
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
	const renderQueue = [];

	this.renderQueue = renderQueue;

	/** @type {BufferRenderer} */
	let bufferRenderer;

	let canvas, gl;

	this.init = async function() {
		canvas = this.getCanvas();
		gl = this.getContext();

		const {currentScale} = instance;

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

		// Buffer renderer initialization
		bufferRenderer = new BufferRenderer(instance);
		await bufferRenderer.prepare();
	};

	/**
	 * @todo Better error handling
	 * @todo Review recursivity
	 * 
	 * Populates the component tree.
	 * Replacement for `GUIRenderer.add`.
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
				this.addChildrenToRenderStack(component) :
				renderQueue.push(component);

			if (component instanceof Button) {
				component.generateCachedTexture(bufferRenderer);
			}
		}
	};

	this.addChildrenToRenderStack = function(parent) {
		// This methods only adds `Group` children
		if (!(parent instanceof Group)) return;

		const
			children = parent.getChildren(),
			{length} = children;

		for (let i = 0, component; i < length; i++) {
			component = children[i];

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component);

				continue;
			}

			/** @todo Rework listener initialization */
			{
				if (component.onMouseEnter) {
					component.onMouseEnter.component = component;

					instance.addMouseEnterListener(component.onMouseEnter);
				}

				if (component.onMouseLeave) {
					component.onMouseLeave.component = component;

					instance.addMouseLeaveListener(component.onMouseLeave);
				}

				if (component.onMouseDown) {
					component.onMouseDown.component = component;

					instance.addMouseDownListener(component.onMouseDown);
				}
			}

			renderQueue.push(component);
		}
	};

	/**
	 * @deprecated
	 * 
	 * Stores the provided components.
	 * 
	 * @param {...Component} comps
	 */
	this.add = function(...comps) {
		const {length} = comps;
		let component;

		function pushToRenderStack() {
			renderQueue.push(this);
		};

		function pushGroupToRenderStack() {
			const children = this.getChildren();
			const {length} = children;

			for (let i = 0; i < length; i++) children[i].pushToRenderStack();
		}

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

				instance.addMouseEnterListener(component.onMouseEnter);
			}

			if (component.onMouseLeave) {
				component.onMouseLeave.component = component;

				instance.addMouseLeaveListener(component.onMouseLeave);
			}

			if (component.onMouseDown) {
				component.onMouseDown.component = component;

				instance.addMouseDownListener(component.onMouseDown);
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
			{length} = componentTree,
			initialPosition = new Vector2(0, 0),
			viewport = instance.getViewport().divideScalar(instance.currentScale);

		for (let i = 0; i < length; i++) componentTree[i].computePosition(initialPosition, viewport);
	};

	/**
	 * Renders the GUI and updates the scene renderer GUI texture.
	 */
	this.render = function() {
		const
			queueLength = renderQueue.length,
			bufferLength = queueLength * 9,
			worldMatrixData = new Float32Array(bufferLength),
			worldMatrices = [],
			textureMatrixData = new Float32Array(bufferLength),
			textureMatrices = [];

		// Register component world/texture matrices
		for (let i = 0, component; i < queueLength; i++) {
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

			component = renderQueue[i];
			const worldMatrix = component.getWorldMatrix();
			const textureMatrix = component.getTextureMatrix();

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
		const textureIndices = new Float32Array(queueLength);
		for (let i = 0; i < queueLength; i++) textureIndices[i] = renderQueue[i].getTextureWrapper().index;
		gl.bufferData(gl.ARRAY_BUFFER, textureIndices, gl.STATIC_DRAW);

		// Clear the render queue
		renderQueue.length = 0;

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, queueLength);

		instance.updateRendererTexture(0, canvas);
	};

	/**
	 * @todo Pass the resize data (w/h (+ dpr?)) from the instance
	 * @param {Vector2} viewport
	 */
	this.resize = function(viewport) {
		const {currentScale} = instance;

		gl.viewport(0, 0, canvas.width = viewport.x, canvas.height = viewport.y);

		const projectionMatrix = Matrix3
			.projection(viewport)
			.scale(new Vector2(currentScale, currentScale));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Add all components to the render stack
		const {length} = componentTree;

		for (let i = 0, component; i < length; i++) {
			component = componentTree[i];

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component);

				continue;
			}

			renderQueue.push(component);
		}

		this.computeTree();
		this.render();
	};
}

GUIRenderer.prototype = Object.create(Renderer.prototype, {
	constructor: {
		value: GUIRenderer,
	},
});





export class _GUIRenderer extends WebGLRenderer {
	constructor({offscreen, version}) {
		super({offscreen, version});

		/**
		 * GUI layer stack. The last layer the current view.
		 * 
		 * @type {Layer[]}
		 */
		this.layerStack = [];

		/**
		 * Components marked for the next render.
		 * 
		 * @type {Component[]}
		 */
		this.renderQueue = [];
	}

	async build() {}
}