import GUIRenderer from "./GUIRenderer.js";
import {OrthographicCamera} from "src/cameras";
import {Component, Group, Layer} from "src/gui";
import {Matrix3, Vector2} from "src/math";
import RendererManager from "../../src/RendererManager.js";

/**
 * @extends RendererManager
 */
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
		this.layerCuts = [];
	}

	async init() {
		const {shaderPath, currentScale} = this.instance;
		const projectionMatrix = Matrix3
			.projection(new Vector2(this.renderer.canvas.width, this.renderer.canvas.height))
			.scale(new Vector2(currentScale, currentScale));

		this.camera.projectionMatrix = projectionMatrix;

		await this.renderer.init(shaderPath, projectionMatrix);
	}

	/**
	 * Populates the component tree.
	 * NOTE: Recursive.
	 * 
	 * @param {Component[]} children
	 * @param {Boolean} [addListeners=false]
	 */
	addChildrenTorenderQueue(children, addListeners = false) {
		for (let i = 0, l = children.length, component; i < l; i++) {
			component = children[i];

			if (component instanceof Group) {
				this.addChildrenTorenderQueue(component.getChildren(), addListeners);

				continue;
			}

			this.renderQueue.push(component);
			this.tree.push(component);

			if (!addListeners) continue;

			this.addListeners(component);
		}
	}

	/**
	 * Initialize event listeners for the provided component.
	 * 
	 * @param {Component} component
	 */
	addListeners(component) {
		const {instance} = this;

		if (component.onMouseDown) {
			component.onMouseDown.component = component;

			instance.addMouseDownListener(component.onMouseDown);
		}

		if (component.onMouseEnter) {
			component.onMouseEnter.component = component;

			instance.addMouseEnterListener(component.onMouseEnter);
		}

		if (component.onMouseLeave) {
			component.onMouseLeave.component = component;

			instance.addMouseLeaveListener(component.onMouseLeave);
		}
	}

	/**
	 * @todo Set instance viewport size as a `Vector2`?
	 * 
	 * Calculates the absolute position for each component.
	 */
	computeTree() {
		const
			{renderQueue} = this,
			initialPosition = new Vector2(0, 0),
			viewport = this.instance.getViewport().divideScalar(this.instance.currentScale);

		for (let i = 0, l = renderQueue.length; i < l; i++) renderQueue[i].computePosition(initialPosition, viewport);
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

		// Add all components to the render stack
		for (let i = 0, l = this.tree.length, component; i < l; i++) {
			component = this.tree[i];

			if (component instanceof Group) {
				this.addChildrenTorenderQueue(component.getChildren(), false);

				continue;
			}

			this.renderQueue.push(component);
		}

		this.computeTree();
		this.render();
	}

	/**
	 * @todo Add the registered components listeners
	 * @todo Remove the old components listeners
	 * 
	 * Builds a new layer on top of the layer stack.
	 * NOTE: Calling this method will result in all the children of the new layer
	 * being registered into the render queue.
	 * The previous registered components won't be removed.
	 * 
	 * @param {Layer} layer
	 */
	push(layer) {
		this.layerStack.push(layer);
		this.layerCuts.push(this.tree.at(-1));

		this.addChildrenTorenderQueue(layer.build(), true);
	}

	/**
	 * @todo Remove the discarded components listeners
	 * @todo Add the registered components listeners 
	 * 
	 * Disposes the last layer from the layer stack.
	 * NOTE: Calling this method will result in all the children of all the stacked layers
	 * being registered into the render queue.
	 * The previous registered components will be removed,
	 * so that they don't get rendered twice in the next frame.
	 */
	pop() {
		const layer = this.layerStack.pop();
		const lastCut = this.layerCuts.pop();
		const {tree} = this;

		layer.dispose();

		// Clear the render queue
		this.renderQueue.length = 0;

		let i = tree.length;

		while (i != lastCut) {
			tree.pop();
			i--;
		}

		this.addChildrenTorenderQueue(this.tree, true);
	}
}