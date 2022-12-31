/**
 * Error throwed when the linking of a WebGLProgram on a
 * WebGLRenderingContext fails due to a WebGLShader compilation error.
 * 
 * @constructor
 * @extends Error
 * @param {String} message Shader info log
 * @param {Number} type Shader type (`VERTEX_SHADER` or `FRAGMENT_SHADER`)
 */
export function ShaderCompilationError(message, type) {
	if (!(this instanceof ShaderCompilationError)) return new ShaderCompilationError(message, type);

	this.message = `${shaderTypes[type]} SHADER ${message}`;
	this.stack = Error().stack;
	this.node = document.createElement("div");
	this.node.classList.add("error");
	this.node.append(this.message);
}

ShaderCompilationError.prototype = Error.prototype;
ShaderCompilationError.prototype.name = "ShaderCompilationError";

const shaderTypes = {
	35632: "FRAGMENT",
	35633: "VERTEX",
};