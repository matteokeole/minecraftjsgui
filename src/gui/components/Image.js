import Component from "./Component.js";

export function Image() {
	Component.call(this, ...arguments);

	this.render = function(gl) {};
}