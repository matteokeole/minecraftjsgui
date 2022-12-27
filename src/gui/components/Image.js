import Component from "./Component.js";
import {Matrix3, Vector2} from "math";

/**
 * Image component.
 * Stores a pre-loaded `WebGLTexture` and render a rectangular part of it.
 * 
 * @constructor
 * @extends Component
 * @param {object} options
 * @param {Texture} options.image
 * @param {Vector2} options.uv
 */
export default function Image({image, uv}) {
	Component.apply(this, arguments);

	/** @type {Texture} */
	this.image = image;

	/** @type {Vector2} */
	this.uv = uv;
}