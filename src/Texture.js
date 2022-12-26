import {Vector2} from "math";

/**
 * Wrapper for WebGLTextures.
 * 
 * @constructor
 * @param {HTMLImageElement} image
 * @param {WebGLTexture} source
 */
export default function Texture(image, source, layer) {
	/** @type {HTMLImageElement} */
	this.image = image;

	/** @type {WebGLTexture} */
	this.source = source;

	/** @type {Number} */
	this.layer = layer;

	/** @type {Vector2} */
	this.size = new Vector2(this.image.width, this.image.height);
}