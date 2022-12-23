import {instance} from "../../../public/main.js";
import {Vector2} from "math";

/**
 * @todo Remove instance import
 * 
 * @constructor
 * @param {object} options
 * @param {String[2]} options.align
 * @param {Vector2} options.margin
 * @param {Vector2} options.size
 */
export default function Component({align, margin, size}) {
	/** @type {Vector2} */
	this.position = null;

	/** @type {String[2]} */
	this.align = align;

	/** @type {Vector2} */
	this.margin = margin;

	/** @type {Vector2} */
	this.size = size;

	/**
	 * Render method called by the GUI renderer at draw time.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 * @param {WebGL2RenderingContext} gl
	 */
	this.render = null;

	/**
	 * Uses the component alignment and margin values to calculate its absolute position.
	 */
	this.computePosition = function() {
		const
			[horizontal, vertical] = this.align,
			{x: mx, y: my} = this.margin,
			{x: w, y: h} = this.size,
			{viewportWidth, viewportHeight, currentScale} = instance;
		let x = 0,
			y = 0,
			ow = viewportWidth / currentScale - w,
			oh = viewportHeight / currentScale - h;

		switch (horizontal) {
			case "left":
				x += mx;

				break;
			case "center":
				x += ow / 2 + mx;

				break;
			case "right":
				x += ow - mx;

				break;
		}

		switch (vertical) {
			case "top":
				y += my;

				break;
			case "center":
				y += oh / 2 + my;

				break;
			case "bottom":
				y += oh - my;

				break;
		}

		this.position = new Vector2(x | 0, y | 0);
	};
}