import {Vector2} from "math";
import Group from "./Group.js";
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
	 * Reference to the parent group.
	 * 
	 * @type {?Group}
	 */
	let group;

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
			[horizontal, vertical] = align,
			{x: mx, y: my} = margin,
			{x: w, y: h} = size;
		let p = new Vector2(0, 0), ow, oh, group;

		if ((group = this.getGroup()) !== undefined) {
			// Grouped component
			const groupSize = group.getSize();

			ow = groupSize.x;
			oh = groupSize.y;

			if (p = group.getPosition() instanceof Vector2) return;

			group.computePosition(instance);
			p = group.getPosition();
		} else {
			// Generic component
			const viewportWidth = instance.getViewportWidth();
			const viewportHeight = instance.getViewportHeight();
			const {currentScale} = instance;

			ow = viewportWidth / currentScale;
			oh = viewportHeight / currentScale;

			p.x = p.y = 0;
		}

		ow -= w;
		oh -= h;

		switch (horizontal) {
			case "left":
				p.x += mx;

				break;
			case "center":
				p.x += ow / 2 + mx;

				break;
			case "right":
				p.x += ow - mx;

				break;
		}

		switch (vertical) {
			case "top":
				p.y += my;

				break;
			case "center":
				p.y += oh / 2 + my;

				break;
			case "bottom":
				p.y += oh - my;

				break;
		}

		position = p.floor();
	};

	this.getGroup = () => group;

	this.setGroup = function(newGroup) {
		if (!(newGroup instanceof Group)) throw TypeError("Tried to set a non-Group value as a parent element.");

		group = newGroup;
	};

	this.getPosition = () => position;

	this.setPosition = function(newPosition) {
		if (!(newPosition instanceof Vector2)) throw TypeError("Tried to set a non-Vector2 value as a position vector.");

		position = newPosition;
	};

	this.getAlignment = () => align;

	this.getMargin = () => margin;

	this.getSize = () => size;

	this.isHovered = () => isHovered;

	this.setIsHovered = value => void (isHovered = !!value);
}