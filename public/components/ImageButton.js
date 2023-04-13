import {DynamicComponent, Subcomponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";

/**
 * @extends DynamicComponent
 * @param {Object} options
 * @param {Texture} image
 * @param {Vector2} uv
 */
export function ImageButton({image, uv}) {
	DynamicComponent.apply(this, arguments);

	this.setTexture(image);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(),
			size: this.getSize(),
			uv,
		}),
	]);
}

extend(ImageButton, DynamicComponent);