export function NoWebGL2Error() {
	this.message = "It seems that your browser doesn't support WebGL2.";
}

NoWebGL2Error.prototype = Error.prototype;