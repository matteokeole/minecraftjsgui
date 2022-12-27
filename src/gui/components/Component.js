import {Vector2} from "math";
import Instance from "../../Instance.js";

/**
 * A GUI component.
 * 
 * @constructor
 * @param {object} options
 * @param {String[2]} options.align
 * @param {Vector2} options.margin
 * @param {Vector2} options.size
 */
export default function Component({align, margin, size}) {
	/**
	 * Component offset from the top-left corner of the viewport.
	 * 
	 * @type {Vector2}
	 */
	let position;

	/**
	 * Determines if the pointer hovers over the component.
	 * 
	 * @type {boolean}
	 */
	let isHovered = false;

	/**
	 * Uses the component alignment and margin values to calculate its absolute position.
	 * 
	 * @param {Instance} instance
	 */
	this.computePosition = function(instance) {
		const
			{viewportWidth, viewportHeight, currentScale} = instance,
			[horizontal, vertical] = align,
			{x: mx, y: my} = margin,
			{x: w, y: h} = size,
			ow = viewportWidth / currentScale - w,
			oh = viewportHeight / currentScale - h;
		let x = 0, y = 0;

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

		position = new Vector2(x | 0, y | 0);
	};

	this.getPosition = () => position;

	this.getAlignment = () => align;

	this.getMargin = () => margin;

	this.getSize = () => size;

	this.isHovered = () => isHovered;

	this.setIsHovered = value => void (isHovered = !!value);
}