import {VisualComponent} from "src/gui";
import {Vector2, Vector3} from "src/math";
import {extend} from "src/utils";
import {gui} from "../main.js";

/**
 * @extends VisualComponent
 * @param {String} text
 * @param {Object} options
 * @param {Vector3} options.color
 */
export function Text(text, {color}) {
	VisualComponent.call(this, arguments[1]);

	/** @type {String[]} */
	const characters = text.split('');
	const subcomponents = [];
	let width = 0;

	for (let i = 0, l = characters.length, character, subcomponent; i < l; i++) {
		character = characters[i];
		subcomponent = (gui.fontSubcomponents[character] ?? gui.fontSubcomponents["undefined"]).clone();
		subcomponent.setOffset(new Vector2(width, 0));

		if (color) {
			subcomponent.setColorMask(color);
			subcomponent.setColorMaskWeight(1);
		}

		subcomponents.push(subcomponent);

		width += subcomponent.getSize().x + 1;
	}

	this.setSize(new Vector2(width, 8)); // This leaves a trailing pixel
	this.setTexture(gui.getTexture("font/ascii.png"));
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