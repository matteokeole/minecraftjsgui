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

	this.getChildren = () => children;

	this.computePosition = instance => {
		const
			viewportWidth = instance.getViewportWidth(),
			viewportHeight = instance.getViewportHeight(),
			{currentScale} = instance,
			[horizontal, vertical] = this.getAlignment(),
			w = viewportWidth / currentScale - this.getSize(0),
			h = viewportHeight / currentScale - this.getSize(1);
		let p = this.getMargin();

		if (horizontal === "right") p.x = w - p.x;
		else if (horizontal === "center") p.x += w / 2;

		if (vertical === "bottom") p.y = h - p.y;
		else if (vertical === "center") p.y += h / 2;

		this.setPosition(p.floor());
	};

	const {length} = children;

	for (let i = 0; i < length; i++) children[i].setGroup(this);
}