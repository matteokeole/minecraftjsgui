import {StructuralComponent} from "src/gui";
import {inherits} from "src/utils";

/**
 * @todo Throw an error if a group child doesn't fit its parent?
 * 
 * @extends StructuralComponent
 */
export default function Group() {
	StructuralComponent.apply(this, arguments);

	/**
	 * @param {Vector2} initialPosition
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initialPosition, parentSize) {
		const align = this.getAlign();
		const margin = this.getMargin();
		const size = this.getSize();
		const length = this.getChildren().length;

		const
			[horizontal, vertical] = align,
			m = margin,
			o = parentSize.substract(size);
		initialPosition = initialPosition.add(m);

		if (horizontal === "right") initialPosition.x = o.x - m.x;
		else if (horizontal === "center") initialPosition.x += o.x / 2;

		if (vertical === "bottom") initialPosition.y = o.y - m.y;
		else if (vertical === "center") initialPosition.y += o.y / 2;

		this.setPosition(initialPosition.floor32());
		const position = this.getPosition();

		for (let i = 0; i < length; i++) {
			children[i].computePosition(position.clone(), size);
		}
	};
}

inherits(StructuralComponent, Group);