import {NotImplementedError} from "src/errors";
import {Matrix3, Vector2} from "src/math";

/**
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
	 * @todo Rework
	 * 
	 * COmputes the absolute position of the component
	 * by using its alignment and margin.
	 * 
	 * @param {Vector2} initial
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initial, parentSize) {
		const
			m = margin,
			o = parentSize.substract(size);

		switch (align) {
			case Component.alignLeftTop:
			case Component.alignLeftCenter:
			case Component.alignLeftBottom:
				initial.x += m.x;

				break;
			case Component.alignCenterTop:
			case Component.alignCenter:
			case Component.alignCenterBottom:
				initial.x += o.x / 2 + m.x;

				break;
			case Component.alignRightTop:
			case Component.alignRightCenter:
			case Component.alignRightBottom:
				initial.x += o.x - m.x;

				break;
		}

		switch (align) {
			case Component.alignLeftTop:
			case Component.alignCenterTop:
			case Component.alignRightTop:
				initial.y += m.y;

				break;
			case Component.alignLeftCenter:
			case Component.alignCenter:
			case Component.alignRightCenter:
				initial.y += o.y / 2 + m.y;

				break;
			case Component.alignLeftBottom:
			case Component.alignCenterBottom:
			case Component.alignRightBottom:
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

/**
 * Component alignment constants.
 * 
 * @type {Number}
 */
Component.alignLeftTop = 0;
Component.alignCenterTop = 1;
Component.alignRightTop = 2;
Component.alignLeftCenter = 3;
Component.alignCenter = 4;
Component.alignRightCenter = 5;
Component.alignLeftBottom = 6;
Component.alignCenterBottom = 7;
Component.alignRightBottom = 8;