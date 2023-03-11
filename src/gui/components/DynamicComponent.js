import VisualComponent from "./VisualComponent.js";
import {inherits} from "../../utils/index.js";

/**
 * @extends VisualComponent
 * @param {{
 *    onMouseEnter: ?Function,
 *    onMouseLeave: ?Function,
 *    onMouseDown: ?Function
 * }}
 */
export default function DynamicComponent({onMouseEnter, onMouseLeave, onMouseDown}) {
	VisualComponent.apply(this, arguments);

	/** @type {Boolean} */
	let isHovered = false;

	/** @returns {Boolean} */
	this.getIsHovered = () => isHovered;

	/** @param {Boolean} value */
	this.setIsHovered = value => void (isHovered = value);

	/** @type {?Function} */
	this.onMouseEnter = onMouseEnter?.bind(this);

	/** @type {?Function} */
	this.onMouseLeave = onMouseLeave?.bind(this);

	/** @type {?Function} */
	this.onMouseDown = onMouseDown?.bind(this);
}

inherits(DynamicComponent, VisualComponent);