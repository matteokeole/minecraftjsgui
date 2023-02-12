import GUIRenderer from "./GUIRenderer.js";
import {OrthographicCamera} from "src/cameras";
import {Component, Group} from "src/gui";
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
	 * Populates the component tree. Replacement for `GUIRenderer.add`.
	 * 
	 * @param {Component[]} tree
	 * @throws {TypeError}
	 */
	setComponentTree(tree) {
		if (!(tree instanceof Array)) throw TypeError("The provided tree must be an instance of Array.");

		for (let i = 0, l = tree.length, component; i < l; i++) {
			component = tree[i];

			this.tree.push(component);

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component);

				// if (component instanceof Button) component.generateCachedTexture(bufferRenderer);
			} else this.renderQueue.push(component);
		}
	}

	/**
	 * @param {Component} parent
	 */
	addChildrenToRenderStack(parent) {
		// This methods only adds `Group` children
		if (!(parent instanceof Group)) return;

		const children = parent.getChildren();
		const {instance} = this;

		for (let i = 0, l = children.length, component; i < l; i++) {
			component = children[i];

			if (component instanceof Group) {
				this.addChildrenToRenderStack(component);

				continue;
			}

			/**
			 * @todo Listeners get added each time (even for a resize event)
			 */
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
}