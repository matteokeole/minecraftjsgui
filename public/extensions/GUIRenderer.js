import {Matrix3, Vector2} from "src/math";
import {Button, Component, Group, Layer} from "src/gui";
import BufferRenderer from "src/buffer-renderer";
import WebGLRenderer from "../../src/WebGLRenderer.js";

/**
 * @todo Don't generate mipmaps?
 * @extends WebGLRenderer
 */
export default class GUIRenderer extends WebGLRenderer {
	/** @type {Instance} */
	#instance;

	/** @type {?BufferRenderer} */
	#bufferRenderer;

	/**
	 * @param {Instance} instance
	 *    Reference to the current instance,
	 *    used for uploading the new render onto the output texture,
	 *    registering listeners, manipulating the GUI scale, etc.
	 */
	constructor(instance) {
		super({
			offscreen: true,
			generateMipmaps: false,
			version: 2,
		});

		this.#instance = instance;

		/**
		 * @public
		 * @type {Component[]}
		 */
		this.componentTree = [];

		/**
		 * List of components marked for redraw.
		 * 
		 * @public
		 * @type {Component[]}
		 */
		this.renderQueue = [];
	}

	async init() {
		const {canvas, gl} = this;
		const {shaderPath, currentScale} = this.#instance;

		/** @type {Program} */
		let program = await this.loadProgram(
			"component.vert",
			"component.frag",
			shaderPath,
		);

		this.linkProgram(program);

		/**
		 * Program shaders won't be used anymore,
		 * remove access to them
		 */
		({program} = program);

		gl.useProgram(program);

		gl.attribute = {
			position: 0,
			worldMatrix: 1,
			textureMatrix: 4,
			textureIndex: 7,
		};
		gl.uniform = {
			projectionMatrix: gl.getUniformLocation(program, "u_projection"),
		};
		gl.buffer = {
			position: gl.createBuffer(),
			worldMatrix: gl.createBuffer(),
			textureMatrix: gl.createBuffer(),
			textureIndex: gl.createBuffer(),
		};
		gl.vao = {
			main: gl.createVertexArray(),
		};

		gl.bindVertexArray(gl.vao.main);

		/** @todo Set projection matrix in orthographic camera */
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
		this.#bufferRenderer = new BufferRenderer(this.#instance);
		await this.#bufferRenderer.prepare();
	}

	/**
	 * @todo Better error handling
	 * @todo Review recursivity
	 * 
	 * Populates the component tree.
	 * Replacement for `GUIRenderer.add`.
	 * 
	 * @throws {TypeError}
	 */
	setComponentTree(tree, instance) {
		if (!(tree instanceof Array)) throw TypeError("The provided tree must be an instance of Array.");

		const {length} = tree;

		for (let i = 0, component; i < length; i++) {
			component = tree[i];

			this.componentTree.push(component);

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component, instance);

				if (component instanceof Button) component.generateCachedTexture(bufferRenderer);
			} else {
				this.renderQueue.push(component);
			}
		}
	}

	addChildrenToRenderStack(parent, instance) {
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

			this.renderQueue.push(component);
		}
	}

	/**
	 * @deprecated
	 * 
	 * Stores the provided components.
	 * 
	 * @param {...Component} comps
	 */
	add(...comps) {
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
	}

	/**
	 * @todo Set instance viewport size as a `Vector2`?
	 * 
	 * Calculates the absolute position for each component.
	 */
	computeTree(instance) {
		const
			{length} = this.componentTree,
			initialPosition = new Vector2(0, 0),
			viewport = instance.getViewport().divideScalar(instance.currentScale);

		for (let i = 0; i < length; i++) this.componentTree[i].computePosition(initialPosition, viewport);
	}

	/**
	 * @todo Must override `WebGLRenderer.render`
	 * 
	 * Renders a GUI frame and updates the output texture.
	 * The instance is required to update the output renderer texture.
	 * 
	 * @param {Instance} instance
	 */
	render(instance) {
		const
			{canvas, gl} = this,
			queueLength = this.renderQueue.length,
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

			component = this.renderQueue[i];
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
		for (let i = 0; i < queueLength; i++) textureIndices[i] = this.renderQueue[i].getTextureWrapper().index;
		gl.bufferData(gl.ARRAY_BUFFER, textureIndices, gl.STATIC_DRAW);

		// Clear the render queue
		this.renderQueue.length = 0;

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, queueLength);

		instance.updateRendererTexture(0, canvas);
	}

	/**
	 * @todo Pass the resize data (w/h (+ dpr?)) from the instance
	 * @todo Must override `WebGLRenderer.resize`
	 * 
	 * @param {Vector2} viewport
	 * @param {Instance} instance
	 */
	resize(viewport, instance) {
		const {canvas, gl} = this;
		const {currentScale} = instance;

		gl.viewport(
			0,
			0,
			canvas.width = viewport.x,
			canvas.height = viewport.y,
		);

		/** @todo Replace by `OrthographicCamera.updateProjectionMatrix` */
		const projectionMatrix = Matrix3
			.projection(viewport)
			.scale(new Vector2(currentScale, currentScale));

	 	gl.uniformMatrix3fv(gl.uniform.projectionMatrix, false, new Float32Array(projectionMatrix));

		// Add all components to the render stack
		const {length} = this.componentTree;

		for (let i = 0, component; i < length; i++) {
			component = this.componentTree[i];

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component, instance);

				continue;
			}

			this.renderQueue.push(component);
		}

		this.computeTree(instance);
		this.render(instance);
	}
}