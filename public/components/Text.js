import {VisualComponent} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {gui} from "../main.js";

/**
 * @extends VisualComponent
 * @param {String} text
 */
export function Text(text) {
	VisualComponent.call(this, arguments[1]);

	/** @type {String[]} */
	const characters = text.split('');
	const subcomponents = [];
	let width = 0;

	for (let i = 0, l = characters.length, character, subcomponent; i < l; i++) {
		character = characters[i];
		subcomponent = (gui.fontSubcomponents[character] ?? gui.fontSubcomponents["undefined"]).clone();

		subcomponent.setOffset(new Vector2(width, 0));

		subcomponents.push(subcomponent);

		width += subcomponent.getSize().x + 1;
	}

	this.setSize(new Vector2(width, 8));
	this.setTexture(gui.renderer.textures["font/ascii.png"]);
	this.setSubcomponents(subcomponents);
}

extend(Text, VisualComponent);