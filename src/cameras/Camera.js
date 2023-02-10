import {NotImplementedError} from "src/errors";
import {Matrix4, Vector3} from "src/math";

export default class Camera {
	constructor() {
		/** @type {Vector3} */
		this.position = new Vector3(0, 0, 0);

		/** @type {Vector3} */
		this.rotation = new Vector3(0, 0, 0);

		/** @type {Matrix4} */
		this.projectionMatrix = Matrix4.identity();
	}

	updateProjectionMatrix() {
		throw new NotImplementedError();
	}
}