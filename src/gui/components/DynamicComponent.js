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
	onMouseEnter &&= configureListener(this, onMouseEnter);

	/** @type {?Listener} */
	onMouseLeave &&= configureListener(this, onMouseLeave);

	/** @type {?Listener} */
	onMouseDown &&= configureListener(this, onMouseDown);

	/** @returns {Boolean} */
	this.getIsHovered = () => isHovered;

	/** @param {Boolean} value */
	this.setIsHovered = value => void (isHovered = value);

	/** @returns {?Listener} */
	this.getOnMouseEnter = () => onMouseEnter;

	/** @param {Listener} value */
	this.setOnMouseEnter = value => void (onMouseEnter = configureListener(this, value));

	/** @returns {?Listener} */
	this.getOnMouseLeave = () => onMouseLeave;

	/** @param {Listener} value */
	this.setOnMouseLeave = value => void (onMouseLeave = configureListener(this, value));

	/** @returns {?Listener} */
	this.getOnMouseDown = () => onMouseDown;

	/** @param {Listener} value */
	this.setOnMouseDown = value => void (onMouseDown = configureListener(this, value));
}

inherits(DynamicComponent, VisualComponent);

function configureListener(component, listener) {
	listener = listener.bind(component);
	listener.component = component;

	return listener;
}