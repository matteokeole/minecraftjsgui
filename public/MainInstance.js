import {Instance} from "src";
import {min, max, Vector4} from "src/math";
import {MainInstanceRenderer} from "./MainInstanceRenderer.js";

export class MainInstance extends Instance {
	/**
	 * @type {Number}
	 */
	#resizeTimeoutId;

	/**
	 * @param {MainInstanceRenderer} renderer
	 */
	constructor(renderer) {
		super(renderer);

		this._parameters = {
			...this._parameters,
			font_path: "",
			shader_path: "",
			texture_path: "",
			current_scale: 0,
			desired_scale: 0,
			max_scale: 0,
			default_width: 320,
			default_height: 240,
			resize_delay: 50,
		};
		this.#resizeTimeoutId = 0;
	}

	/**
	 * @returns {Number}
	 */
	getResizeTimeoutId() {
		return this.#resizeTimeoutId;
	}

	/**
	 * @param {Number} resizeTimeoutId
	 */
	setResizeTimeoutId(resizeTimeoutId) {
		this.#resizeTimeoutId = resizeTimeoutId;
	}

	/**
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} dpr
	 */
	resize(width, height, dpr) {
		const viewport = new Vector4(0, 0, width, height)
			.multiplyScalar(dpr)
			.floor();

		this.getRenderer().setViewport(viewport);

		// Calculate scale multiplier
		let i = 1;
		while (
			viewport[2] > this.getParameter("default_width") * dpr * i &&
			viewport[3] > this.getParameter("default_height") * dpr * i
		) i++;

		this.setParameter("max_scale", max(i - 1, 1));

		{
			const desiredScale = this.getParameter("desired_scale");
			const maxScale = this.getParameter("max_scale");

			this.setParameter("current_scale", min(desiredScale, maxScale));
		}

		const composites = this.getComposites();
		const compositeCount = this.getComposites().length;

		for (i = 0; i < compositeCount; i++) {
			composites[i].resize(viewport);
		}
	}
}