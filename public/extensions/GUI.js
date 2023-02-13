import GUIRenderer from "./GUIRenderer.js";
import {OrthographicCamera} from "src/cameras";
import {Component, Group, Layer} from "src/gui";
import {Matrix3, Vector2} from "src/math";
import RendererManager from "../../src/RendererManager.js";

export default class GUI extends RendererManager {
	/**
	 * @param {Instance} instance
	 *    Reference to the current instance,
	 *    used for uploading the new render onto the output texture,
	 *    registering listeners, manipulating the GUI scale, etc.
	 * 
	 * @param {GUIRenderer} renderer
	 */
	constructor(instance, renderer) {
		super();

		/** @type {Instance} */
		this.instance = instance;

		/** @type {WebGLRenderer} */
		this.renderer = renderer;

		/** @type {Camera} */
		this.camera = new OrthographicCamera(this.instance.getViewport());

		/** @type {Layer[]} */
		this.layerStack = [];

		/** @type {Component[]} */
		this.tree = [];

		/** @type {Component[]} */
		this.renderQueue = [];
	}

	async init() {
		const {shaderPath, currentScale} = this.instance;

		/** @todo Set projection matrix in orthographic camera */
		this.camera.projectionMatrix = Matrix3
			.projection(new Vector2(this.renderer.canvas.width, this.renderer.canvas.height))
			.scale(new Vector2(currentScale, currentScale));

		await this.renderer.init(shaderPath, currentScale, this.camera.projectionMatrix);
	}

	/**
	 * @todo Better error handling
	 * @todo Rework recursivity
	 * 
	 * Populates the component tree.
	 * 
	 * @param {Component[]} tree
	 * @param {Boolean} [addListeners=false]
	 * @throws {TypeError}
	 */
	setComponentTree(tree, addListeners = false) {
		if (!(tree instanceof Array)) throw TypeError("The provided tree must be an instance of Array.");

		for (let i = 0, l = tree.length, component; i < l; i++) {
			component = tree[i];

			this.tree.push(component);

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component, addListeners);

				continue;
			}

			this.renderQueue.push(component);

			if (!addListeners) continue;

			/**
			 * @todo Bug: Listeners get added each time (even for a resize event)
			 */
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
		}
	}

	/**
	 * @param {Component} parent
	 * @param {Boolean} [addListeners=false]
	 */
	addChildrenToRenderStack(parent, addListeners = false) {
		// This methods only adds `Group` children
		if (!(parent instanceof Group)) return;

		const children = parent.getChildren();
		const {instance} = this;

		for (let i = 0, l = children.length, component; i < l; i++) {
			component = children[i];

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component, addListeners);

				continue;
			}

			this.renderQueue.push(component);

			if (!addListeners) continue;

			/**
			 * @todo Bug: Listeners get added each time (even for a resize event)
			 */
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
		}
	}

	/**
	 * @todo Set instance viewport size as a `Vector2`?
	 * 
	 * Calculates the absolute position for each component.
	 */
	computeTree() {
		const
			{length} = this.tree,
			initialPosition = new Vector2(0, 0),
			viewport = this.instance.getViewport().divideScalar(this.instance.currentScale);

		for (let i = 0; i < length; i++) this.tree[i].computePosition(initialPosition, viewport);
	}

	render() {
		console.log("Render", this.layerStack);

		this.renderer.render(this.renderQueue, this.camera);

		// Clear the render queue
		this.renderQueue.length = 0;

		this.instance.updateRendererTexture(0, this.renderer.canvas);
	}

	resize(viewport) {
		const {currentScale} = this.instance;

		/** @todo Replace by `OrthographicCamera.updateProjectionMatrix` */
		this.camera.projectionMatrix = Matrix3
			.projection(viewport)
			.scale(new Vector2(currentScale, currentScale));

		this.renderer.resize(viewport, this.camera.projectionMatrix);

		// Add all components to the render stack
		for (let i = 0, l = this.tree.length, component; i < l; i++) {
			component = this.tree[i];

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component);

				continue;
			}

			this.renderQueue.push(component);
		}

		this.computeTree();
		this.render();
	}

	/**
	 * @todo Add the registered components listeners
	 * 
	 * Adds a new layer on top of the layer stack.
	 * NOTE: Calling this method will result in all the children of the new layer
	 * being registered into the render queue.
	 * The previous registered components won't be removed.
	 * 
	 * @param {Layer} layer
	 */
	push(layer) {
		this.layerStack.push(layer);
		this.setComponentTree(layer.build(), true);
	}

	/**
	 * @todo Remove the discarded components listeners
	 * 
	 * Removes the last layer from the layer stack.
	 * NOTE: Calling this method will result in all the children of all the stacked layers
	 * being registered into the render queue.
	 * The previous registered components will be removed,
	 * so that they don't get rendered twice in a frame.
	 */
	pop() {
		this.layerStack.pop();

		// Clear the render queue
		this.renderQueue.length = 0;

		this.setComponentTree(this.tree, true);
	}
}