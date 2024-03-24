import {GUIComposite} from "../../src/Composite/index.js";
import {Subcomponent} from "../../src/GUI/index.js";
import {VisualComponent} from "../../src/GUI/Component/index.js";
import {MouseDownEvent, MouseMoveEvent} from "../../src/GUI/Event/index.js";
import {Vector2, intersects} from "../../src/math/index.js";
import {TextureWrapper} from "../../src/Wrapper/index.js";

/**
 * @typedef {(context: GUIComposite) => void} EventListener
 */

/**
 * @typedef {Object} ImageButtonDescriptor
 * @property {Number} alignment
 * @property {Vector2} [margin]
 * @property {Vector2} size
 * @property {String[]} events
 * @property {TextureWrapper} texture
 * @property {Vector2} uv
 * @property {EventListener} [onMouseDown]
 * @property {EventListener} [onMouseEnter]
 * @property {EventListener} [onMouseLeave]
 */

export class ImageButton extends VisualComponent {
	/**
	 * @type {Boolean}
	 */
	#isHovered;

	/**
	 * @type {?EventListener}
	 */
	#onMouseDown;

	/**
	 * @type {?EventListener}
	 */
	#onMouseEnter;

	/**
	 * @type {?EventListener}
	 */
	#onMouseLeave;

	/**
	 * @param {ImageButtonDescriptor} descriptor
	 */
	constructor(descriptor) {
		super(descriptor);

		this.#isHovered = false;
		this.#onMouseDown = descriptor.onMouseDown;
		this.#onMouseEnter = descriptor.onMouseEnter;
		this.#onMouseLeave = descriptor.onMouseLeave;

		this.setSubcomponents([
			new Subcomponent({
				size: descriptor.size,
				uv: descriptor.uv,
			}),
		]);
	}

	/**
	 * @param {Vector2} carry
	 * @param {GUIComposite} context
	 */
	[MouseDownEvent.NAME](carry, context) {
		if (!intersects(new Vector2(carry).divideScalar(2), this.getPosition(), this.getSize())) {
			return;
		}

		this.#onMouseDown(context);
	}

	/**
	 * @param {Vector2} carry
	 * @param {GUIComposite} context
	 */
	[MouseMoveEvent.NAME](carry, context) {
		const isIntersecting = intersects(new Vector2(carry).divideScalar(2), this.getPosition(), this.getSize());

		if (!this.#isHovered && isIntersecting) {
			this.#isHovered = true;

			this.#onMouseEnter(context);

			return;
		}

		if (this.#isHovered && !isIntersecting) {
			this.#isHovered = false;

			this.#onMouseLeave(context);
		}
	}
}