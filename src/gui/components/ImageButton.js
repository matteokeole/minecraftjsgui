import {Matrix3, Vector2} from "math";
import Component from "./Component.js";
import TextureWrapper from "../../TextureWrapper.js";

/**
 * @constructor
 * @extends Component
 * @param {{
 *    image: Texture,
 *    uv: Vector2,
 *    onMouseEnter: Function,
 *    onMouseLeave: Function,
 *    onMouseDown: Function
 * }}
 */
export default function ImageButton({image, uv, onMouseEnter, onMouseLeave, onMouseDown}) {
	Component.apply(this, arguments);

	/** @type {TextureWrapper} */
	this.image = image;

	/** @type {Vector2} */
	this.uv = uv;

	/** @type {Function} */
	this.onMouseEnter = onMouseEnter?.bind(this);

	/** @type {Function} */
	this.onMouseLeave = onMouseLeave?.bind(this);

	/** @type {Function} */
	this.onMouseDown = onMouseDown?.bind(this);
}