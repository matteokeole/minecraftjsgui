import {NotImplementedError} from "../errors/index.js";
import {Matrix3, Vector3} from "../math/index.js";

export default class Camera {
	constructor() {
		/** @type {Vector3} */
		this.position = new Vector3(0, 0, 0);

		/** @type {Vector3} */
		this.rotation = new Vector3(0, 0, 0);

		/** @type {Matrix3} */
		this.projectionMatrix = Matrix3.identity();
	}

	updateProjectionMatrix() {
		throw new NotImplementedError();
	}
}