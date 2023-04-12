import {AbstractInstance} from "src";
import {Vector2, clampDown, clampUp} from "src/math";
import {extend} from "src/utils";
import {InstanceRenderer} from "./InstanceRenderer.js";

/** @param {InstanceRenderer} renderer */
export function Instance(renderer) {
	AbstractInstance.call(this, renderer);

	let resizeTimeoutId;

	/** @returns {Number} */
	this.getResizeTimeoutId = () => resizeTimeoutId;

	/** @param {Number} value */
	this.setResizeTimeoutId = value => void (resizeTimeoutId = value);
}

extend(Instance, AbstractInstance);

/**
 * @param {Number} width
 * @param {Number} height
 * @param {Number} dpr
 */
Instance.prototype.resize = function(width, height, dpr) {
	/** @type {Vector2} */
	const viewport = new Vector2(width, height)
		.multiplyScalar(dpr)
		.floor();

	this.getRenderer().setViewport(viewport);

	// Calculate scale multiplier
	let i = 1;
	while (
		viewport[0] > this.getParameter("default_width") * dpr * i &&
		viewport[1] > this.getParameter("default_height") * dpr * i
	) i++;

	this.setParameter("max_scale", clampDown(i - 1, 1));

	{
		const desiredScale = this.getParameter("desired_scale");
		const maxScale = this.getParameter("max_scale");

		this.setParameter("current_scale", clampUp(desiredScale, maxScale));
	}

	const composites = this.getComposites();
	const compositeCount = this.getRenderer().getCompositeCount();

	for (i = 0; i < compositeCount; i++) composites[i].resize(viewport);
};