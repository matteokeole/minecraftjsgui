import {Subcomponent} from "src/gui";
import {ReactiveComponent} from "src/gui/components";
import {Vector2} from "src/math";
import {extend} from "src/utils";

/**
 * @extends ReactiveComponent
 * @param {Object} options
 * @param {Texture} image
 * @param {Vector2} uv
 */
export function ImageButton({image, uv}) {
	ReactiveComponent.apply(this, arguments);

	this.setTexture(image);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(),
			size: this.getSize(),
			uv,
		}),
	]);
}

extend(ImageButton, ReactiveComponent);