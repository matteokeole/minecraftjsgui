import {Subcomponent} from "../../src/gui/index.js";
import {ReactiveComponent} from "../../src/gui/components/index.js";
import {Vector2} from "../../src/math/index.js";
import {TextureContainer} from "../../src/wrappers/index.js";

export class ImageButton extends ReactiveComponent {
	/**
	 * @param {Object} options
	 * @param {Number} options.alignment
	 * @param {Vector2} [options.margin]
	 * @param {Vector2} options.size
	 * @param {TextureContainer} options.image
	 * @param {Vector2} options.uv
	 * @param {?import("../../src/gui/components/ReactiveComponent.js").EventListener} [options.onMouseDown]
	 * @param {?import("../../src/gui/components/ReactiveComponent.js").EventListener} [options.onMouseEnter]
	 * @param {?import("../../src/gui/components/ReactiveComponent.js").EventListener} [options.onMouseLeave]
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