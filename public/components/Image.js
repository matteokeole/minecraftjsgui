import {Subcomponent} from "../../src/GUI/index.js";
import {VisualComponent} from "../../src/GUI/Component/index.js";
import {Vector2} from "../../src/math/index.js";
import {TextureWrapper} from "../../src/Wrapper/index.js";

/**
 * @typedef {Object} ImageDescriptor
 * @property {Number} alignment
 * @property {Vector2} [margin]
 * @property {Vector2} size
 * @property {TextureWrapper} image
 * @property {Vector2} uv
 */

export class Image extends VisualComponent {
	/**
	 * @param {ImageDescriptor} descriptor
	 */
	constructor(descriptor) {
		super(descriptor);

		this.setTexture(descriptor.image);
		this.setSubcomponents([
			new Subcomponent({
				size: descriptor.size,
				uv: descriptor.uv,
			}),
		]);
	}
}