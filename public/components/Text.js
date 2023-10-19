import {Font} from "src/fonts";
import {VisualComponent} from "src/gui/components";
import {Vector2, Vector3, Vector4} from "src/math";
import {guiComposite as context} from "../main.js";

export class Text extends VisualComponent {
	/**
	 * @type {Vector3}
	 */
	static BLACK = new Vector3(0, 0, 0);

	/**
	 * @type {Vector3}
	 */
	static DARK_BLUE = new Vector3(0, 0, 170);

	/**
	 * @type {Vector3}
	 */
	static DARK_GREEN = new Vector3(0, 170, 0);

	/**
	 * @type {Vector3}
	 */
	static DARK_AQUA = new Vector3(0, 170, 170);

	/**
	 * @type {Vector3}
	 */
	static DARK_RED = new Vector3(170, 0, 0);

	/**
	 * @type {Vector3}
	 */
	static DARK_PURPLE = new Vector3(170, 0, 170);

	/**
	 * @type {Vector3}
	 */
	static GOLD = new Vector3(255, 170, 0);

	/**
	 * @type {Vector3}
	 */
	static GRAY = new Vector3(170, 170, 170);

	/**
	 * @type {Vector3}
	 */
	static DARK_GRAY = new Vector3(85, 85, 85);

	/**
	 * @type {Vector3}
	 */
	static BLUE = new Vector3(85, 85, 255);

	/**
	 * @type {Vector3}
	 */
	static GREEN = new Vector3(85, 255, 85);

	/**
	 * @type {Vector3}
	 */
	static AQUA = new Vector3(85, 255, 255);

	/**
	 * @type {Vector3}
	 */
	static RED = new Vector3(255, 85, 85);

	/**
	 * @type {Vector3}
	 */
	static LIGHT_PURPLE = new Vector3(255, 85, 255);

	/**
	 * @type {Vector3}
	 */
	static YELLOW = new Vector3(255, 255, 85);

	/**
	 * @type {Vector3}
	 */
	static WHITE = new Vector3(255, 255, 255);

	/**
	 * @param {String} text
	 * @param {Object} options
	 * @param {Font} options.font
	 * @param {Vector3} options.color
	 */
	constructor(text, {font, color, ...defaults}) {
		super(defaults);

		const colorMask = color ?
			new Vector4(...color, 255) :
			new Vector4(255, 255, 255, 255);
		const {glyphs, size} = font.generateGlyphsFromString(text, colorMask);

		this.setSize(size);
		this.setTexture(context.getTexture(font.getTexturePath()));
		this.setSubcomponents(glyphs);
	}
}