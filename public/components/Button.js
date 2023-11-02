import {Subcomponent} from "src/gui";
import {ReactiveComponent} from "src/gui/components";
import {Vector2} from "src/math";
import {guiComposite as context} from "../main.js";

export class Button extends ReactiveComponent {
	/**
	 * @type {Number}
	 */
	static DEFAULT_WIDTH = 200;

	/**
	 * @type {Number}
	 */
	static HEIGHT = 20;

	/**
	 * @param {Object} options
	 * @param {Number} options.alignment
	 * @param {Vector2} [options.margin]
	 * @param {Number} options.width
	 * @param {Boolean} [options.disabled]
	 * @param {?Function} [options.onMouseDown]
	 * @param {?Function} [options.onMouseEnter]
	 * @param {?Function} [options.onMouseLeave]
	 */
	constructor({alignment, margin, width, disabled = false, onMouseDown = null, onMouseEnter = null, onMouseLeave = null}) {
		super({
			alignment,
			margin,
			size: new Vector2(),
		});

		const halfWidth = width * .5;
		const subcomponents = [
			new Subcomponent({
				offset: new Vector2(),
				size: new Vector2(halfWidth, 20),
				uv: new Vector2(0, disabled ? 46 : 66),
			}),
			new Subcomponent({
				offset: new Vector2(halfWidth, 0),
				size: new Vector2(halfWidth, 20),
				uv: new Vector2(Button.DEFAULT_WIDTH - halfWidth, disabled ? 46 : 66),
			}),
		];

		this.setSize(new Vector2(width, Button.HEIGHT));
		this.setTexture(context.getTexture("gui/widgets.png"));
		this.setSubcomponents(subcomponents);
		this.setOnMouseDown(function(p) {
			if (disabled) return;

			onMouseDown?.(p);
		});
		this.setOnMouseEnter(function(p) {
			if (disabled) return;

			onMouseEnter?.(p);

			subcomponents[0].setUV(new Vector2(0, 86));
			subcomponents[1].setUV(new Vector2(Button.DEFAULT_WIDTH - halfWidth, 86));

			context.pushToRenderQueue(this).render();
		});
		this.setOnMouseLeave(function(p) {
			if (disabled) return;

			onMouseLeave?.(p);

			subcomponents[0].setUV(new Vector2(0, 66));
			subcomponents[1].setUV(new Vector2(Button.DEFAULT_WIDTH - halfWidth, 66));

			context.pushToRenderQueue(this).render();
		});
	}
}