import {VisualComponent} from "src/gui";
import {inherits} from "src/utils";

/**
 * @extends VisualComponent
 * @param {{
 *    image: TextureWrapper
 * }}
 */
export default function Image({image}) {
	VisualComponent.apply(this, arguments);

	this.setTexture(image);
}

inherits(Image, VisualComponent);