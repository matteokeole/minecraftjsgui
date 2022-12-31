/**
 * Error throwed when `Instance.initialize()`
 * gets an empty `WebGL2RenderingContext`.
 * 
 * @constructor
 * @extends Error
 */
export function NoWebGL2Error() {
	if (!(this instanceof NoWebGL2Error)) return new NoWebGL2Error();

	this.message = "It seems that your browser doesn't support WebGL2.";
	this.stack = Error().stack;
	this.node = document.createElement("div");

	const img = document.createElement("img");
	img.src = "assets/images/webgl.png";
	img.alt = '';

	this.node.classList.add("error");
	this.node.append(img, this.message);
}

NoWebGL2Error.prototype = Error.prototype;
NoWebGL2Error.prototype.name = "NoWebGL2Error";