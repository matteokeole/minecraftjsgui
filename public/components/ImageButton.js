import {DynamicComponent, Subcomponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";

/**
 * @extends DynamicComponent
 * @param {{
 *    image: Texture,
 *    uv: Vector2
 * }}
 */
export default function ImageButton({image, uv}) {
	DynamicComponent.apply(this, arguments);

	this.setTexture(image);
	this.setSubcomponents([
		new Subcomponent({
			offset: new Vector2(0, 0),
			size: this.getSize(),
			uv,
		}),
	]);
}

extend(ImageButton, DynamicComponent);