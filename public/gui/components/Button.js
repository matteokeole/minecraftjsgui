import {DynamicComponent} from "src/gui";
import {inherits} from "src/utils";

/**
 * @extends DynamicComponent
 */
export default function Button() {
	DynamicComponent.apply(this, arguments);

	/* this.generateCachedTexture = function(bufferRenderer) {
		bufferRenderer.resizeToComponentSize(this.getSize());
	}; */
}

inherits(DynamicComponent, Button);