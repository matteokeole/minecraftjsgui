import {Vector2} from "math";

/**
 * WebGLTexture layer constructor.
 * 
 * @constructor
 * @param {Image} image
 * @param {WebGLTexture} source
 */
export default function Texture(image, source) {
	/** @type {Image} */
	this.image = image;

	/** @type {WebGLTexture} */
	this.source = source;

	/**
	 * Returns the base image size as a Vector2.
	 * 
	 * @returns {Vector2}
	 */
	this.getSizeVector = () => new Vector2(
		this.image.width,
		this.image.height,
	);
}