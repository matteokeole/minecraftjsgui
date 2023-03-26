import {Subcomponent, VisualComponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {gui} from "../../main.js";

/** @type {Number} */
const BUTTON_HEIGHT = 20;

/**
 * @extends VisualComponent
 * @param {{
 *    width: Number
 * }}
 */
export default function Button({width}) {
	VisualComponent.apply(this, arguments);

	const halfWidth = width * .5;

	// this.setSize(new Vector2(width, BUTTON_HEIGHT));
	// this.setUv();
	this.setTexture(gui.renderer.textures["gui/widgets.png"]);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(0, 0),
			size: new Vector2(halfWidth, 20),
			uv: new Vector2(0, 0),
		}),
		new Subcomponent({
			offset: new Vector2(halfWidth, 0),
			size: new Vector2(halfWidth, 20),
			uv: new Vector2(0, 0),
		}),
	]);
}

extend(Button, VisualComponent);