import GUIRenderer from "./GUIRenderer.js";
import {OrthographicCamera} from "src/cameras";
import {Component, Layer} from "src/gui";
import {Matrix3, Vector2} from "src/math";
import RendererManager from "src/manager";
import Group from "./components/Group.js";

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

		/**
		 * @todo Replace by `builtComponents`?
		 * 
		 * Children of currently built layers.
		 * 
		 * @type {Component[]}
		 */
		this.tree = [];

		/**
		 * Components registered for the next render.
		 * 
		 * @type {Component[]}
		 */
		this.renderQueue = [];

		/** @type {Number[]} */
		this.lastInsertionIndices = [];
	}

	async init() {
		const {shaderPath, currentScale} = this.instance;
		const viewport = this.instance.getViewport();
		const projectionMatrix = this.camera.projectionMatrix = Matrix3
			.projection(viewport)
			.scale(new Vector2(currentScale, currentScale));

		await this.renderer.init(shaderPath, projectionMatrix);
	}

	/**
	 * Populates the component tree.
	 * NOTE: Recursive.
	 * 
	 * @param {Component[]} children
	 * @param {Boolean} [addListeners=false]
	 * @param {Boolean} [addToTree=false]
	 */
	addChildrenToRenderQueue(children, addListeners = false, addToTree = false) {
		for (let i = 0, l = children.length, component; i < l; i++) {
			component = children[i];

			if (component instanceof Group) {
				this.addChildrenToRenderQueue(component.getChildren(), addListeners, addToTree);

				continue;
			}

			this.renderQueue.push(component);
			addListeners && this.addListeners(component);
			addToTree && this.tree.push(component);
		}
	}

	/**
	 * Initialize event listeners for the provided component.
	 * 
	 * @param {Component} component
	 */
	addListeners(component) {
		const {instance} = this;
		let listener;

		if (listener = component.getOnMouseDown()) instance.addMouseDownListener(listener);
		if (listener = component.getOnMouseEnter()) instance.addMouseEnterListener(listener);
		if (listener = component.getOnMouseLeave()) instance.addMouseLeaveListener(listener);
	}

	/**
	 * Discards event listeners for the provided component.
	 * 
	 * @param {Component[]} components
	 */
	removeListeners(components) {
		const {instance} = this;

		for (let i = 0, l = components.length, component, listener; i < l; i++) {
			component = components[i];

			if (listener = component.getOnMouseDown()) instance.removeMouseDownListener(listener);
			if (listener = component.getOnMouseEnter()) instance.removeMouseEnterListener(listener);
			if (listener = component.getOnMouseLeave()) instance.removeMouseLeaveListener(listener);
		}
	}

	/**
	 * Computes the absolute position for each component of the render queue.
	 */
	computeTree() {
		const {renderQueue} = this;
		const parentSize = this.instance
			.getViewport()
			.divideScalar(this.instance.currentScale);

		for (let i = 0, l = renderQueue.length; i < l; i++) {
			renderQueue[i].computePosition(new Vector2(0, 0), parentSize);
		}
	}

	render() {
		this.renderer.render(this.renderQueue, this.camera);

		// Clear the render queue
		this.renderQueue.length = 0;

		this.instance.updateRendererTexture(0, this.renderer.canvas);
	}

	/**
	 * Resizes the viewport of the renderer and triggers a new render.
	 * NOTE: Resize events render ALL the components from the layer stack.
	 * 
	 * @param {Vector2} viewport
	 */
	resize(viewport) {
		const {currentScale} = this.instance;

		/** @todo Replace by `OrthographicCamera.updateProjectionMatrix` */
		this.camera.projectionMatrix = Matrix3
			.projection(viewport)
			.scale(new Vector2(currentScale, currentScale));

		this.renderer.resize(viewport, this.camera.projectionMatrix);

		// Add all components to the render queue
		for (let i = 0, l = this.tree.length, component; i < l; i++) {
			component = this.tree[i];

			if (component instanceof Group) {
				this.addChildrenToRenderQueue(component.getChildren(), false, false);

				continue;
			}

			this.renderQueue.push(component);
		}

		this.computeTree();
		this.render();
	}

	/**
	 * Builds a new layer on top of the layer stack.
	 * Calling this method will result in all the children of the new layer
	 * being registered into the render queue.
	 * The new components will be rendered on top of the previous ones.
	 * 
	 * @param {Layer} layer
	 */
	push(layer) {
		this.layerStack.push(layer);

		// Discard event listeners of previous layers
		this.removeListeners(this.tree);

		this.lastInsertionIndices.push(this.tree.length);
		this.addChildrenToRenderQueue(layer.build(), true, true);

		this.computeTree();
		this.render();
	}

	/**
	 * Disposes the last layer from the layer stack.
	 * Calling this method will result in all the children of all the stacked layers
	 * being registered into the render queue.
	 * NOTE: The first layer cannot be popped.
	 */
	pop() {
		const {layerStack} = this;

		if (layerStack.length === 1) return;

		const layer = layerStack.pop();
		layer.dispose();

		const lastInsertion = this.lastInsertionIndices.pop();

		/** @todo Rework event listener discard */
		const componentsToDiscard = [...this.tree].splice(lastInsertion);
		this.removeListeners(componentsToDiscard);

		/** @todo Rework component removal */
		this.tree = this.tree.slice(0, lastInsertion);

		// Clear the render queue
		this.renderQueue.length = 0;

		this.addChildrenToRenderQueue(this.tree, true, false);

		this.computeTree();
		this.renderer.clear(); // Clear already rendered components
		this.render();

		this.instance.updateRendererTexture(0, this.renderer.canvas);
	}
}