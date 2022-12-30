import Component from "./Component.js";

/**
 * @todo Documentation
 * @constructor
 * @extends Component
 * @param {{
 *    children: Component[]
 * }}
 */
export default function Group({children}) {
	Component.apply(this, arguments);

	const align = this.getAlignment();
	const margin = this.getMargin();
	const size = this.getSize();

	this.getChildren = () => children;

	const childLength = children.length;

	/**
	 * @todo Documentation
	 * @todo Replace `{x, y}` objects by `Vector2` instances
	 * 
	 * @param {Vector2} initialPosition
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initialPosition, parentSize) {
		const
			[horizontal, vertical] = align,
			w = parentSize.x - size.x,
			h = parentSize.y - size.y;
		initialPosition = initialPosition.add(margin);

		if (horizontal === "right") initialPosition.x = w - margin.x;
		else if (horizontal === "center") initialPosition.x += w / 2;

		if (vertical === "bottom") initialPosition.y = h - margin.y;
		else if (vertical === "center") initialPosition.y += h / 2;

		this.setPosition(initialPosition.floor());

		const position = this.getPosition();

		for (let i = 0; i < childLength; i++) children[i].computePosition(position.clone(), size);
	};
}