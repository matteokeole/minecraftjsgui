import {Vector2} from "../math/index.js";

/**
 * @param {{
 *    offset: Vector2,
 *    size: Vector2,
 *    uv: Vector2
 * }}
 */
export function Subcomponent({offset, size, uv}) {
	/** @returns {Vector2} */
	this.getOffset = () => offset;

	/** @returns {Vector2} */
	this.getSize = () => size;

	/** @returns {Vector2} */
	this.getUV = () => uv;
}