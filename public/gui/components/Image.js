import {VisualComponent} from "src/gui";
import {extend} from "src/utils";

/**
 * @extends VisualComponent
 * @param {{
 *    image: Texture
 * }}
 */
export default function Image({image}) {
	VisualComponent.apply(this, arguments);

	this.setTexture(image);
}

extend(Image, VisualComponent);