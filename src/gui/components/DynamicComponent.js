import VisualComponent from "./VisualComponent.js";
import {inherits} from "../../utils/index.js";

/** @typedef {(position: Vector2) => void} Listener */

/**
 * @extends VisualComponent
 * @param {{
 *    onMouseEnter: ?Listener,
 *    onMouseLeave: ?Listener,
 *    onMouseDown: ?Listener
 * }}
 */
export default function DynamicComponent({onMouseEnter, onMouseLeave, onMouseDown}) {
	VisualComponent.apply(this, arguments);

	/** @type {Boolean} */
	let isHovered = false;

	/** @type {?Listener} */
	if (onMouseEnter) {
		onMouseEnter = onMouseEnter.bind(this);
		onMouseEnter.component = this;
	}

	/** @type {?Listener} */
	if (onMouseLeave) {
		onMouseLeave = onMouseLeave.bind(this);
		onMouseLeave.component = this;
	}

	/** @type {?Listener} */
	if (onMouseDown) {
		onMouseDown = onMouseDown.bind(this);
		onMouseDown.component = this;
	}

	/** @returns {Boolean} */
	this.getIsHovered = () => isHovered;

	/** @param {Boolean} value */
	this.setIsHovered = value => void (isHovered = value);

	/** @returns {?Listener} */
	this.getOnMouseEnter = () => onMouseEnter;

	/** @param {Listener} value */
	this.setOnMouseEnter = value => void (onMouseEnter = value);

	/** @returns {?Listener} */
	this.getOnMouseLeave = () => onMouseLeave;

	/** @param {Listener} value */
	this.setOnMouseLeave = value => void (onMouseLeave = value);

	/** @returns {?Listener} */
	this.getOnMouseDown = () => onMouseDown;

	/** @param {Listener} value */
	this.setOnMouseDown = value => void (onMouseDown = value);
}

inherits(DynamicComponent, VisualComponent);