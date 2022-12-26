import {Matrix3, Vector2} from "math";
import Component from "./Component.js";
import Texture from "../../Texture.js";

/**
 * @constructor
 * @extends Component
 * @param {{
 *    image: Texture,
 *    uv: Vector2,
 *    onMouseEnter: Function,
 *    onMouseLeave: Function,
 *    onMouseDown: Function
 * }}
 */
export default function ImageButton({image, uv, onMouseEnter, onMouseLeave, onMouseDown}) {
	Component.apply(this, arguments);

	/** @type {Texture} */
	this.image = image;

	/** @type {Vector2} */
	this.uv = uv;

	/** @type {Function} */
	this.onMouseEnter = onMouseEnter?.bind(this);

	/** @type {Function} */
	this.onMouseLeave = onMouseLeave?.bind(this);

	/** @type {Function} */
	this.onMouseDown = onMouseDown?.bind(this);

	/** @override */
	this.render = function(gl) {
		const
			worldMatrix = Matrix3
				.translate(this.position)
				.scale(this.size),
			imageSize = this.image.size,
			textureMatrix = Matrix3
				.translate(this.uv.divide(imageSize))
				.scale(this.size.divide(imageSize));

		gl.uniformMatrix3fv(gl.uniform.worldMatrix, false, new Float32Array(worldMatrix));
		gl.uniformMatrix3fv(gl.uniform.textureMatrix, false, new Float32Array(textureMatrix));
		gl.bindTexture(gl.TEXTURE_2D, image.source);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};
}