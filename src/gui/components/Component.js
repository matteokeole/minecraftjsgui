import {NotImplementedError} from "src/errors";
import {Matrix3, Vector2} from "src/math";

/**
 * @todo Pass `align` as constant, e.g. `Component.alignLeftTop`
 * 
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
	 * @todo Review + documentation
	 * 
	 * COmputes the absolute position of the component
	 * by using its alignment and margin.
	 * 
	 * @param {Vector2} initial
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initial, parentSize) {
		const
			[horizontal, vertical] = align,
			m = margin,
			o = parentSize.substract(size);

		switch (horizontal) {
			case "left":
				initial.x += m.x;

				break;
			case "center":
				initial.x += o.x / 2 + m.x;

				break;
			case "right":
				initial.x += o.x - m.x;

				break;
		}

		switch (vertical) {
			case "top":
				initial.y += m.y;

				break;
			case "center":
				initial.y += o.y / 2 + m.y;

				break;
			case "bottom":
				initial.y += o.y - m.y;

				break;
		}

		position = initial.floor32();
	};

	this.getPosition = () => position;

	this.setPosition = function(newPosition) {
		if (!(newPosition instanceof Vector2)) throw TypeError("Tried to set a non-Vector2 value as a position vector.");

		position = newPosition;
	};

	this.getAlignment = () => align;

	this.getMargin = () => margin;

	this.getSize = () => size;

	this.getWorldMatrix = () => Matrix3.translate(position).scale(size);

	/**
	 * Must be overridden in an instance.
	 * 
	 * @returns {Matrix3}
	 * @throws {NotImplementedError}
	 */
	this.getTextureMatrix = () => {
		throw new NotImplementedError();
	};

	/**
	 * Must be overridden in an instance.
	 * 
	 * @returns {TextureWrapper}
	 * @throws {NotImplementedError}
	 */
	this.getTextureWrapper = () => {
		throw new NotImplementedError();
	};
}