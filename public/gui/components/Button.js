import {DynamicComponent} from "src/gui";
import {Vector2} from "src/math";
import {inherits} from "src/utils";

const BUTTON_HEIGHT = 20;

/**
 * @extends DynamicComponent
 * @param {{
 *    width: Number
 * }}
 */
export default function Button({width, image}) {
	DynamicComponent.apply(this, arguments);

	if (!Number.isInteger(width) || +width < 0) throw TypeError(`Expecting an instance of Number greater than 0, ${width.constructor.name} given`);

	this.setSize(new Vector2(width, BUTTON_HEIGHT));
	this.setUV(new Vector2(0, 0));

	/** @todo TextureGenerator */
	this.setTexture(image);
}

inherits(DynamicComponent, Button);