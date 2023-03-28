import {Subcomponent, VisualComponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";

/**
 * @extends VisualComponent
 * @param {{
 *    image: Texture,
 *    uv: Vector2
 * }}
 */
export function Image({image, uv}) {
	VisualComponent.apply(this, arguments);

	this.setTexture(image);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(0, 0),
			size: this.getSize(),
			uv,
		}),
	]);
}

extend(Image, VisualComponent);