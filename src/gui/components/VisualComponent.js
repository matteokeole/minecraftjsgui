import {Component} from "../index.js";
import {Vector2} from "../../math/index.js";
import Texture from "../../Texture.js";
import {extend} from "../../utils/index.js";

const TEXTURE_SIZE = new Vector2(256, 256);

/**
 * @extends Component
 */
export function VisualComponent() {
	Component.apply(this, arguments);

	/** @type {Subcomponent[]} */
	let subcomponents = [];

	/** @type {Texture} */
	let texture;

	/** @returns {Subcomponent[]} */
	this.getSubcomponents = () => subcomponents;

	/** @param {Subcomponent[]} value */
	this.setSubcomponents = value => void (subcomponents = value);

	/** @returns {Texture} */
	this.getTexture = function() {
		if (!(texture instanceof Texture)) throw TypeError(`Expecting an instance of Texture, ${texture} given`);

		return texture;
	};

	/** @param {Texture} value */
	this.setTexture = value => void (texture = value);

	// /** @returns {Matrix3} */
	// this.getTextureMatrix = () => Matrix3
	// .translate(this.getUV().divide(TEXTURE_SIZE))
	// .scale(this.getSize().divide(TEXTURE_SIZE));

	// /** @returns {Vector2} */
	// this.getUV = () => uv;

	// /** @param {Vector2} value */
	// this.setUV = value => void (uv = value);
}

extend(VisualComponent, Component);