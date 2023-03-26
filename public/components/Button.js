import {Subcomponent, VisualComponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {gui} from "../main.js";

/** @type {Number} */
const DEFAULT_WIDTH = 200;

/** @type {Number} */
const BUTTON_HEIGHT = 20;

/**
 * @todo Add `disabled` attribute
 * 
 * @extends VisualComponent
 * @param {{
 *    width: Number
 * }}
 */
export default function Button({width}) {
	VisualComponent.apply(this, arguments);

	const halfWidth = width * .5;

	this.setSize(new Vector2(width, BUTTON_HEIGHT));
	this.setTexture(gui.renderer.textures["gui/widgets.png"]);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(0, 0),
			size: new Vector2(halfWidth, 20),
			uv: new Vector2(0, 86),
		}),
		new Subcomponent({
			offset: new Vector2(halfWidth, 0),
			size: new Vector2(halfWidth, 20),
			uv: new Vector2(DEFAULT_WIDTH - halfWidth, 86),
		}),
	]);
}

extend(Button, VisualComponent);