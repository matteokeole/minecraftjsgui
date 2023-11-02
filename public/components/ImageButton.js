import {Subcomponent} from "src/gui";
import {ReactiveComponent} from "src/gui/components";
import {Vector2} from "src/math";
import {TextureContainer} from "src/wrappers";

export class ImageButton extends ReactiveComponent {
	/**
	 * @param {Object} options
	 * @param {Number} options.alignment
	 * @param {Vector2} [options.margin]
	 * @param {Vector2} options.size
	 * @param {TextureContainer} options.image
	 * @param {Vector2} options.uv
	 * @param {?Function} [options.onMouseDown]
	 * @param {?Function} [options.onMouseEnter]
	 * @param {?Function} [options.onMouseLeave]
	 */
	constructor({alignment, margin, size, image, uv, onMouseDown = null, onMouseEnter = null, onMouseLeave = null}) {
		super({alignment, margin, size, onMouseDown, onMouseEnter, onMouseLeave});

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