import Component from "./Component.js";
import {Matrix3} from "src/math";

/**
 * Image component.
 * Stores a pre-loaded `WebGLTexture` and renders a rectangular part of it.
 * 
 * @constructor
 * @extends Component
 * @param {{
 *    image: TextureWrapper,
 *    uv: Vector2
 * }}
 */
export default function Image({image, uv}) {
	Component.apply(this, arguments);

	this.getImageSize = () => image.size;

	this.getImageIndex = () => image.index;

	this.getUV = () => uv;

	/** @override */
	this.getTextureMatrix = () => Matrix3
		.translate(uv.divide(image.size))
		.scale(this.getSize().divide(image.size));
}