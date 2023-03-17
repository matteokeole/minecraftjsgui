import {Component, StructuralComponent} from "src/gui";
import {inherits} from "src/utils";

/**
 * @todo Throw an error if a group child doesn't fit its parent?
 * 
 * @extends StructuralComponent
 */
export default function Group() {
	StructuralComponent.apply(this, arguments);

	/**
	 * @override
	 * @param {Vector2} initial
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initial, parentSize) {
		const parent = this.getParent();

		if (parent) {
			initial = parent.getPosition().clone();
			parentSize = parent.getSize().clone();
		}

		const align = this.getAlign();
		const size = this.getSize();
		const m = this.getMargin();
		const o = parentSize.subtract(size);

		initial = initial.add(m);

		switch (align) {
			/* case Component.alignLeftTop:
			case Component.alignLeftCenter:
			case Component.alignLeftBottom:
				initial.x += m.x;

				break; */
			case Component.alignCenterTop:
			case Component.alignCenter:
			case Component.alignCenterBottom:
				// initial.x += o.x / 2 + m.x;
				initial.x += o.x / 2;

				break;
			case Component.alignRightTop:
			case Component.alignRightCenter:
			case Component.alignRightBottom:
				// initial.x += o.x - m.x;
				initial.x = o.x - m.x;

				break;
		}

		switch (align) {
			/* case Component.alignLeftTop:
			case Component.alignCenterTop:
			case Component.alignRightTop:
				initial.y += m.y;

				break; */
			case Component.alignLeftCenter:
			case Component.alignCenter:
			case Component.alignRightCenter:
				// initial.y += o.y / 2 + m.y;
				initial.y += o.y / 2;

				break;
			case Component.alignLeftBottom:
			case Component.alignCenterBottom:
			case Component.alignRightBottom:
				// initial.y += o.y - m.y;
				initial.y = o.y - m.y;

				break;
		}

		this.setPosition(initial.floor32());
	};
}

inherits(Group, StructuralComponent);