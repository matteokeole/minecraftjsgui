import {Component, StructuralComponent} from "../../src/gui/components/index.js";
import {Vector2} from "../../src/math/index.js";

export class Group extends StructuralComponent {
	/**
	 * @param {Object} options
	 * @param {Number} options.alignment
	 * @param {Vector2} [options.margin]
	 * @param {Vector2} options.size
	 * @param {Component[]} options.children
	 */
	constructor({alignment, margin, size, children}) {
		super({alignment, margin, size, children});
	}
}