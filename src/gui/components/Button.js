import Component from "./Component.js";
import {Matrix3, Vector2} from "src/math";

/**
 * @todo Documentation
 * 
 * @extends Component
 */
export default function Button() {
	Component.apply(this, arguments);

	const size = this.getSize();

	/** @todo Make dynamic */
	const uv = new Vector2(0, 0);

	/** @todo */
	this.generateCachedTexture = function(bufferRenderer) {
		bufferRenderer.resizeToComponentSize(size);
	};

	/** @override */
	this.getTextureMatrix = () => Matrix3.translate(uv.divide(size));
}