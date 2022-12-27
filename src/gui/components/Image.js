import Component from "./Component.js";

/**
 * Image component.
 * Stores a pre-loaded `WebGLTexture` and renders a rectangular part of it.
 * 
 * @constructor
 * @extends Component
 * @param {object} options
 * @param {TextureWrapper} options.image
 * @param {Vector2} options.uv
 */
export default function Image({image, uv}) {
	Component.apply(this, arguments);

	this.getImageSize = () => image.size;

	this.getImageIndex = () => image.index;

	this.getUV = () => uv;
}