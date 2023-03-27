import {VisualComponent} from "src/gui";
import {extend} from "src/utils";

/**
 * @extends VisualComponent
 * @param {String} text
 * @param {Object} options
 * @param {Boolean} options.dropShadow
 */
export function Text(text, {dropShadow}) {
	VisualComponent.apply(this, arguments);

	// /** @type {String[]} */
	// const characters = text.split('');
}

extend(Text, VisualComponent);