import {DynamicComponent} from "src/gui";
import {inherits} from "src/utils";

/**
 * @extends DynamicComponent
 * @param {{
 *    image: TextureWrapper
 * }}
 */
export default function ImageButton({image}) {
	DynamicComponent.apply(this, arguments);

	this.setTexture(image);
}

inherits(ImageButton, DynamicComponent);