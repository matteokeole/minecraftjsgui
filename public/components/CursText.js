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
export function CursText(text, {color}) {
	VisualComponent.call(this, arguments[1]);

	/** @type {String[]} */
	const characters = text.split('');
	const subcomponents = [];
	const fontSubcomponents = gui.getFontSubcomponents();
	let width = 0;

	for (let i = 0, l = characters.length, character, subcomponent; i < l; i++) {
		character = characters[i];
		subcomponent = (fontSubcomponents[character] ?? fontSubcomponents["undefined"]).clone();
		subcomponent.setOffset(new Vector2(width, 0));
		subcomponent.setColorMask(new Vector3(255, 255, 255));
		subcomponent.setColorMaskWeight(1);

		subcomponents.push(subcomponent);

		width += subcomponent.getSize().x + 1;
	}

	this.setSize(new Vector2(width, 8)); // This leaves a trailing pixel
	this.setTexture(gui.getTexture("font/curs.png"));
	this.setSubcomponents(subcomponents);
}

extend(CursText, VisualComponent);