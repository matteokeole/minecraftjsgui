import Camera from "./Camera.js";
import {Matrix3} from "../math/index.js";

export default class OrthographicCamera extends Camera {
	/**
	 * @param {Vector2} viewport
	 */
	constructor(viewport) {
		super();

		/** @type {Vector2} */
		this.viewport = viewport;
	}

	/** @override */
	updateProjectionMatrix() {
		this.projectionMatrix = Matrix3.projection(this.viewport);
	}
}