/**
 * Error throwed when calling non-implemented functions.
 * 
 * @constructor
 * @extends Error
 */
export function NotImplementedError() {
	if (!(this instanceof NotImplementedError)) return new NotImplementedError();

	this.message = "This feature is not implemented yet.";
	this.stack = Error().stack;
}

NotImplementedError.prototype = Error.prototype;
NotImplementedError.prototype.name = "NotImplementedError";