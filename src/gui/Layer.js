import {NotImplementedError} from "src/errors";

export default class Layer {
	constructor() {
		/** @type {?Object} */
		this.state = {};
	}

	/**
	 * @returns {Component[]}
	 */
	build() {
		throw new NotImplementedError();
	}

	dispose() {
		delete this.state;
	}
}