import {clampDown, clampUp} from "math";

/**
 * @todo Apply settings
 * 
 * Game instance singleton.
 * This holds information about asset base paths, viewport dimensions and GUI scale.
 * 
 * @constructor
 */
function Instance() {
	if (Instance._instance) return Instance._instance;

	Instance._instance = this;

	const DEFAULT_WIDTH = 320;
	const DEFAULT_HEIGHT = 240;

	/**
	 * Shader folder path, relative to the root folder.
	 * 
	 * @type {?string}
	 */
	this.shaderPath = null;

	/**
	 * Texture folder path, relative to the root folder.
	 * 
	 * @type {?string}
	 */
	this.texturePath = null;

	/**
	 * Cached value of device pixel ratio.
	 * 
	 * @type {?number}
	 */
	this.devicePixelRatio = null;

	/**
	 * Cached value of window inner width.
	 * 
	 * @type {?number}
	 */
	this.viewportWidth = innerWidth;

	/**
	 * Cached value of window inner height.
	 * 
	 * @type {?number}
	 */
	this.viewportHeight = innerHeight;

	/**
	 * @todo Since this is controlled by the user, move it to a public class?
	 * 
	 * GUI scale multiplier chosen by the user.
	 * 
	 * @type {?number}
	 */
	this.desiredScale = 2;

	/**
	 * Current GUI scale multiplier.
	 * Determines the scale of the crosshair and most of the GUI components.
	 * 
	 * @type {?number}
	 */
	this.currentScale = 2;

	/**
	 * Maximum GUI scale multiplier appliable to the current viewport.
	 * This caps the desired scale multiplier.
	 * 
	 * @type {?number}
	 */
	this.maxScale = 4;

	/**
	 * Resize function.
	 * - When called, recalculates the max possible GUI scale for the current viewport dimensions
	 * - Clamps up the desired scale to the max scale to get the current scale
	 * 
	 * @param {number} width
	 * @param {number} height
	 * @param {number} dpr
	 */
	this.resize = function(width, height, dpr) {
		/** @todo Set viewport size as multiples of 2? */
		this.viewportWidth = /* (width / 2 | 0) * 2 */ width * dpr | 0;
		this.viewportHeight = /* (height / 2 | 0) * 2 */ height * dpr | 0;
		this.devicePixelRatio = dpr;

		// Calculate scale multiplier
		let i = 1;
		while (
			this.viewportWidth > DEFAULT_WIDTH * i &&
			this.viewportHeight > DEFAULT_HEIGHT * i
		) i++;

		const currentScale = clampUp(
			this.desiredScale,
			this.maxScale = clampDown(i - 1, 1),
		);

		if (currentScale === this.currentScale) return;

		this.currentScale = currentScale;

		/** @todo Redraw the GUI with the new scale here? */
	};
}

export default new Instance();