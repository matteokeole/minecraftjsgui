import {NotImplementedError} from "src/errors";

export default class Layer {
	constructor() {
		/** @type {?Object} */
		this.state = {};
	}

	initState() {
		throw new NotImplementedError();
	}

	/**
	 * @returns {Component[]}
	 */
	build() {
		throw new NotImplementedError();
	}

	dispose() {
		this.state = null;
	}
}