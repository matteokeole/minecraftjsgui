import {NotImplementedError} from "src/errors";
import {Matrix3, Vector2} from "src/math";

/**
 * @todo Summary
 * 
 * @abstract
 * @param {{
 *    align: String[2],
 *    margin: Vector2,
 *    size: Vector2,
 * }}
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
	 * @todo Review + documentation
	 * 
	 * Uses the component alignment and margin values to calculate its absolute position.
	 * 
	 * @param {Vector2} initialPosition
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initialPosition, parentSize) {
		const
			[horizontal, vertical] = align,
			m = margin,
			o = parentSize.substract(size);

		switch (horizontal) {
			case "left":
				initialPosition.x += m.x;

				break;
			case "center":
				initialPosition.x += o.x / 2 + m.x;

				break;
			case "right":
				initialPosition.x += o.x - m.x;

				break;
		}

		switch (vertical) {
			case "top":
				initialPosition.y += m.y;

				break;
			case "center":
				initialPosition.y += o.y / 2 + m.y;

				break;
			case "bottom":
				initialPosition.y += o.y - m.y;

				break;
		}

		position = initialPosition.floor32();
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

	this.getWorldMatrix = () => Matrix3.translate(position).scale(size);

	/**
	 * Must be overridden in an instance.
	 * 
	 * @returns {Matrix3}
	 */
	this.getTextureMatrix = () => {throw new NotImplementedError()};

	/**
	 * Must be overridden in an instance.
	 * 
	 * @returns {TextureWrapper}
	 */
	this.getTextureWrapper = () => {throw new NotImplementedError()};
}