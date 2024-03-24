import {GUIComposite} from "../../src/Composite/index.js";
import {Subcomponent} from "../../src/GUI/index.js";
import {VisualComponent} from "../../src/GUI/Component/index.js";
import {MouseDownEvent, MouseMoveEvent} from "../../src/GUI/Event/index.js";
import {Vector2, intersects} from "../../src/math/index.js";

/**
 * @typedef {(context: GUIComposite) => void} EventListener
 */

/**
 * @typedef {Object} ButtonDescriptor
 * @property {Number} alignment
 * @property {Vector2} [margin]
 * @property {Number} width
 * @property {String[]} [events]
 * @property {Boolean} [disabled]
 * @property {EventListener} [onMouseDown]
 * @property {EventListener} [onMouseEnter]
 * @property {EventListener} [onMouseLeave]
 * @property {GUIComposite} context
 */

export class Button extends VisualComponent {
	/**
	 * @type {Number}
	 */
	static #DEFAULT_WIDTH = 200;

	/**
	 * @type {Number}
	 */
	static #HEIGHT = 20;

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
	 * @param {ButtonDescriptor} descriptor
	 */
	constructor(descriptor) {
		super({
			alignment: descriptor.alignment,
			margin: descriptor.margin,
			size: new Vector2(descriptor.width, Button.#HEIGHT),
			events: (descriptor.events ?? []).concat([MouseMoveEvent.NAME]),
		});

		const halfWidth = descriptor.width * .5;
		const disabled = descriptor.disabled ?? false;
		const context = descriptor.context;

		this.#isHovered = false;
		this.#onMouseDown = function(context) {
			if (disabled) {
				return;
			}

			descriptor.onMouseDown?.(context);
		};
		this.#onMouseEnter = function(context) {
			if (disabled) {
				return;
			}

			descriptor.onMouseEnter?.(context);

			this.getSubcomponents()[0].setUV(new Vector2(0, 86));
			this.getSubcomponents()[1].setUV(new Vector2(Button.#DEFAULT_WIDTH - halfWidth, 86));

			context.pushToRenderQueue(this);
			context.render();
		};
		this.#onMouseLeave = function(context) {
			if (disabled) {
				return;
			}

			descriptor.onMouseLeave?.(context);

			this.getSubcomponents()[0].setUV(new Vector2(0, 66));
			this.getSubcomponents()[1].setUV(new Vector2(Button.#DEFAULT_WIDTH - halfWidth, 66));

			context.pushToRenderQueue(this);
			context.render();
		};

		this.setTexture(context.getTexture("gui/widgets.png"));
		this.setSubcomponents([
			new Subcomponent({
				offset: new Vector2(),
				size: new Vector2(halfWidth, 20),
				uv: new Vector2(0, disabled ? 46 : 66),
			}),
			new Subcomponent({
				offset: new Vector2(halfWidth, 0),
				size: new Vector2(halfWidth, 20),
				uv: new Vector2(Button.#DEFAULT_WIDTH - halfWidth, disabled ? 46 : 66),
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