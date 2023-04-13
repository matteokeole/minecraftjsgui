import {DynamicComponent, Subcomponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {guiComposite as context} from "../main.js";

/** @type {Number} */
const DEFAULT_WIDTH = 200;

/** @type {Number} */
const BUTTON_HEIGHT = 20;

/**
 * @extends DynamicComponent
 * @param {Object} options
 * @param {Number} width
 * @param {Boolean} disabled
 * @param {?Function} onMouseDown
 * @param {?Function} onMouseEnter
 * @param {?Function} onMouseLeave
 */
export function Button({width, disabled, onMouseDown: onMouseDownClient, onMouseEnter: onMouseEnterClient, onMouseLeave: onMouseLeaveClient}) {
	DynamicComponent.apply(this, arguments);

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
			uv: new Vector2(DEFAULT_WIDTH - halfWidth, disabled ? 46 : 66),
		}),
	];

	this.setSize(new Vector2(width, BUTTON_HEIGHT));
	this.setTexture(context.getTexture("gui/widgets.png"));
	this.setSubcomponents(subcomponents);
	this.setOnMouseDown(function(p) {
		if (disabled) return;

		onMouseDownClient?.(p);
	});
	this.setOnMouseEnter(function(p) {
		if (disabled) return;

		onMouseEnterClient?.(p);

		subcomponents[0].setUV(new Vector2(0, 86));
		subcomponents[1].setUV(new Vector2(DEFAULT_WIDTH - halfWidth, 86));

		context.pushToRenderQueue(this).render();
	});
	this.setOnMouseLeave(function(p) {
		if (disabled) return;

		onMouseLeaveClient?.(p);

		subcomponents[0].setUV(new Vector2(0, 66));
		subcomponents[1].setUV(new Vector2(DEFAULT_WIDTH - halfWidth, 66));

		context.pushToRenderQueue(this).render();
	});
}

extend(Button, DynamicComponent);