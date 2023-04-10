import {Font} from "src";
import {VisualComponent} from "src/gui";
import {Vector2, Vector3} from "src/math";
import {extend} from "src/utils";
import {guiComposite as context} from "../main.js";

/**
 * @extends VisualComponent
 * @param {String} text
 * @param {Object} options
 * @param {?Font} [options.font]
 * @param {Vector3} options.color
 */
export function Text(text, {font, color}) {
	VisualComponent.call(this, arguments[1]);

	font ??= context.getMainFont();

	/** @type {?Object.<String, Subcomponent>} */
	const fontCharacters = font.getCharacters();

	/** @type {Number} */
	const letterSpacing = font.getLetterSpacing();

	/** @type {String[]} */
	const characters = text.split('');
	const subcomponents = [];
	let width = 0;

	for (let i = 0, l = characters.length, symbol, subcomponent; i < l; i++) {
		symbol = characters[i];
		subcomponent = (fontCharacters[symbol] ?? fontCharacters[""]).clone();
		subcomponent.setOffset(new Vector2(width, 0));

		if (color) {
			subcomponent.setColorMask(color);
			subcomponent.setColorMaskWeight(1);
		}

		subcomponents.push(subcomponent);

		width += subcomponent.getSize().x + letterSpacing;
	}

	this.setSize(new Vector2(width, 8));
	this.setTexture(context.getTexture(font.getTexturePath()));
	this.setSubcomponents(subcomponents);
}

extend(Text, VisualComponent);

Text.BLACK = new Vector3(0, 0, 0);
Text.DARK_BLUE = new Vector3(0, 0, 170);
Text.DARK_GREEN = new Vector3(0, 170, 0);
Text.DARK_AQUA = new Vector3(0, 170, 170);
Text.DARK_RED = new Vector3(170, 0, 0);
Text.DARK_PURPLE = new Vector3(170, 0, 170);
Text.GOLD = new Vector3(255, 170, 0);
Text.GRAY = new Vector3(170, 170, 170);
Text.DARK_GRAY = new Vector3(85, 85, 85);
Text.BLUE = new Vector3(85, 85, 255);
Text.GREEN = new Vector3(85, 255, 85);
Text.AQUA = new Vector3(85, 255, 255);
Text.RED = new Vector3(255, 85, 85);
Text.LIGHT_PURPLE = new Vector3(255, 85, 255);
Text.YELLOW = new Vector3(255, 255, 85);
Text.WHITE = new Vector3(255, 255, 255);