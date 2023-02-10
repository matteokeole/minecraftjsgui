import {Matrix4} from "src/math";
import Camera from "./Camera.js";

export default class OrthographicCamera extends Camera {
	constructor() {
		super();

		/** @override */
		this.projectionMatrix = Matrix4.orthographic();
	}

	/** @todo */
	/** @override */
	updateProjectionMatrix() {}
}