import {NotImplementedError} from "./errors/index.js";
import Instance from "./Instance.js";
import WebGLRenderer from "./WebGLRenderer.js";

/**
 * @todo Convert to function constructor
 */
export default class RendererManager {
	/**
	 * @param {Instance} instance
	 * @param {WebGLRenderer} renderer
	 */
	constructor(instance, renderer) {
		/** @type {Instance} */
		this.instance = instance;

		/** @type {WebGLRenderer} */
		this.renderer = renderer;
	}

	init() {
		throw new NotImplementedError();
	}

	render() {
		throw new NotImplementedError();
	}

	resize() {
		throw new NotImplementedError();
	}
}