import {NotImplementedError} from "../errors/index.js";

/** @todo Documentation */
export default function Layer() {}

/**
 * @todo Return an array of components or a single component?
 * 
 * Creates and returns the component structure of the layer.
 * 
 * @returns {Component[]}
 */
Layer.prototype.build = function() {
	throw new NotImplementedError();
};

/** @todo Documentation */
Layer.prototype.dispose = function() {
	throw new NotImplementedError();
};