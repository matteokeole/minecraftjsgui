import {Vector2} from "math";

/**
 * Wrapper for WebGLTextures.
 * 
 * @constructor
 * @param {HTMLImageElement} image
 * @param {WebGLTexture} source
 * @param {Number} index
 */
export default function TextureWrapper(texture, image, index) {
	/** @type {WebGLTexture} */
	this.texture = texture;

	/** @type {HTMLImageElement} */
	this.image = image;

	/**
	 * Index of this texture in the texture array.
	 * 
	 * @type {Number}
	 */
	this.index = index;

	/** @type {Vector2} */
	this.size = new Vector2(this.image.width, this.image.height);
}