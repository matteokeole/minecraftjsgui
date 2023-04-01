import {DynamicComponent, Subcomponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {gui} from "../main.js";

/** @type {Number} */
const DEFAULT_WIDTH = 200;

/** @type {Number} */
const BUTTON_HEIGHT = 20;

/**
 * @extends DynamicComponent
 * @param {{
 *    width: Number,
 *    disabled: Boolean,
 *    onMouseEnter: ?Function,
 *    onMouseLeave: ?Function,
 *    onMouseDown: ?Function,
 * }}
 */
export function Button({width, disabled, onMouseEnter: onMouseEnterClient, onMouseLeave: onMouseLeaveClient, onMouseDown: onMouseDownClient}) {
	DynamicComponent.apply(this, arguments);

	const halfWidth = width * .5;
	const subcomponents = [
		new Subcomponent({
			offset: new Vector2(0, 0),
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
	this.setTexture(gui.getTexture("gui/widgets.png"));
	this.setSubcomponents(subcomponents);
	this.setOnMouseEnter(function(p) {
		if (disabled) return;

		onMouseEnterClient?.(p);

		subcomponents[0].setUV(new Vector2(0, 86));
		subcomponents[1].setUV(new Vector2(DEFAULT_WIDTH - halfWidth, 86));

		gui.renderQueue.push(this);
		gui.render();
	});
	this.setOnMouseLeave(function(p) {
		if (disabled) return;

		onMouseLeaveClient?.(p);

		subcomponents[0].setUV(new Vector2(0, 66));
		subcomponents[1].setUV(new Vector2(DEFAULT_WIDTH - halfWidth, 66));

		gui.renderQueue.push(this);
		gui.render();
	});
	this.setOnMouseDown(function(p) {
		if (disabled) return;

		onMouseDownClient?.(p);
	});
}

extend(Button, DynamicComponent);