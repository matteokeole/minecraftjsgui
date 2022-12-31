import Component from "./Component.js";

/**
 * @todo Documentation
 * @todo Throw an error if a group child doesn't fit its parent?
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

	// Cache the child length
	const childLength = children.length;

	/**
	 * @todo Review + documentation
	 * 
	 * @param {Vector2} initialPosition
	 * @param {Vector2} parentSize
	 */
	this.computePosition = function(initialPosition, parentSize) {
		const
			[horizontal, vertical] = align,
			m = margin,
			o = parentSize.substract(size);
		initialPosition = initialPosition.add(m);

		if (horizontal === "right") initialPosition.x = o.x - m.x;
		else if (horizontal === "center") initialPosition.x += o.x / 2;

		if (vertical === "bottom") initialPosition.y = o.y - m.y;
		else if (vertical === "center") initialPosition.y += o.y / 2;

		this.setPosition(initialPosition.floor());

		const position = this.getPosition();

		for (let i = 0; i < childLength; i++) children[i].computePosition(position.clone(), size);
	};
}