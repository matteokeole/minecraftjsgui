import {Component} from "../index.js";
import {Matrix3, Vector2} from "../../math/index.js";
import TextureWrapper from "../../TextureWrapper.js";
import {extend} from "../../utils/index.js";

/**
 * @extends Component
 * @param {{
 *    uv: Vector2
 * }}
 */
export function VisualComponent({uv}) {
	Component.apply(this, arguments);

	/** @type {Subcomponent[]} */
	let subcomponents = [];

	/** @type {TextureWrapper} */
	let texture;

	/** @returns {Subcomponent[]} */
	this.getSubcomponents = () => subcomponents;

	/** @param {Subcomponent[]} value */
	this.setSubcomponents = value => void (subcomponents = value);

	/** @returns {TextureWrapper} */
	this.getTexture = function() {
		if (!(texture instanceof TextureWrapper)) throw TypeError(`Expecting an instance of TextureWrapper, ${texture} given`);

		return texture;
	};

	/** @param {TextureWrapper} value */
	this.setTexture = value => void (texture = value);

	/** @returns {Matrix3} */
	this.getTextureMatrix = function() {
		const textureSize = new Vector2(256, 256);

		return Matrix3
			.translate(this.getUV().divide(textureSize))
			.scale(this.getSize().divide(textureSize));
	};

	/** @returns {Vector2} */
	this.getUV = () => uv;

	/** @param {Vector2} value */
	this.setUV = value => void (uv = value);
}

extend(VisualComponent, Component);