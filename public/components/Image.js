import {Subcomponent} from "src/gui";
import {VisualComponent} from "src/gui/components";
import {Vector2} from "src/math";
import {TextureContainer} from "src/wrappers";

export class Image extends VisualComponent {
	/**
	 * @param {Object} options
	 * @param {Number} options.alignment
	 * @param {Vector2} [options.margin]
	 * @param {Vector2} options.size
	 * @param {TextureContainer} options.image
	 * @param {Vector2} options.uv
	 */
	constructor({alignment, margin, size, image, uv}) {
		super({alignment, margin, size});

		this.setTexture(image);
		this.setSubcomponents([
			new Subcomponent({
				offset: new Vector2(),
				size,
				uv,
			}),
		]);
	}
}