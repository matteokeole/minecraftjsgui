import {Subcomponent} from "src/gui";
import {VisualComponent} from "src/gui/components";
import {Vector2} from "src/math";
import {extend} from "src/utils";

/**
 * @extends VisualComponent
 * @param {Object} options
 * @param {Texture} image
 * @param {Vector2} uv
 */
export function Image({image, uv}) {
	VisualComponent.apply(this, arguments);

	this.setTexture(image);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(),
			size: this.getSize(),
			uv,
		}),
	]);
}

extend(Image, VisualComponent);