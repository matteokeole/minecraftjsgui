import {GUIComposite} from "../../src/Composite/index.js";
import {BitmapFont} from "../../src/Font/index.js";
import {VisualComponent} from "../../src/GUI/Component/index.js";
import {Vector2, Vector3, Vector4} from "../../src/math/index.js";

/**
 * @typedef {Object} TextDescriptor
 * @property {Number} alignment
 * @property {Vector2} [margin]
 * @property {BitmapFont} font
 * @property {Vector3} color
 * @property {GUIComposite} context
 */

export class Text extends VisualComponent {
	static BLACK = new Vector3(0, 0, 0);
	static DARK_BLUE = new Vector3(0, 0, 170);
	static DARK_GREEN = new Vector3(0, 170, 0);
	static DARK_AQUA = new Vector3(0, 170, 170);
	static DARK_RED = new Vector3(170, 0, 0);
	static DARK_PURPLE = new Vector3(170, 0, 170);
	static GOLD = new Vector3(255, 170, 0);
	static GRAY = new Vector3(170, 170, 170);
	static DARK_GRAY = new Vector3(85, 85, 85);
	static BLUE = new Vector3(85, 85, 255);
	static GREEN = new Vector3(85, 255, 85);
	static AQUA = new Vector3(85, 255, 255);
	static RED = new Vector3(255, 85, 85);
	static LIGHT_PURPLE = new Vector3(255, 85, 255);
	static YELLOW = new Vector3(255, 255, 85);
	static WHITE = new Vector3(255, 255, 255);

	/**
	 * @param {String} text
	 * @param {TextDescriptor} descriptor
	 */
	constructor(text, descriptor) {
		super({
			alignment: descriptor.alignment,
			margin: descriptor.margin,
			size: new Vector2(),
		});

		const font = descriptor.font;
		const color = descriptor.color;
		const context = descriptor.context;
		const colorMask = color ?
			new Vector4(...color, 255) :
			new Vector4(255, 255, 255, 255);
		const {glyphs, size} = font.generateGlyphsFromString(text, 1, colorMask);

		this.setSize(size);
		this.setTexture(context.getTexture(font.getTexturePath()));
		this.setSubcomponents(glyphs);
	}
}