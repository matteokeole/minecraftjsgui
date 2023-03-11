/**
 * `extends` keyword polyfill for function constructors.
 * 
 * @param {Object} child
 * @param {Object} parent
 */
export default function inherits(child, parent) {
	const prototype = Object.create(parent.prototype);
	prototype.constructor = child;

	child.prototype = prototype;
}