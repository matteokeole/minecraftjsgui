import {Vector2} from "./math/index.js";

/**
 * Wrapper for `WebGLTexture` objects.
 * 
 * @param {HTMLImageElement} image
 * @param {Number} index
 */
export default function TextureWrapper(image, index) {
	/** @type {HTMLImageElement} */
	this.image = image;

	/** @type {Vector2} */
	this.size = new Vector2(this.image.width, this.image.height);

	/** @returns {Number} */
	this.getIndex = () => index;
}