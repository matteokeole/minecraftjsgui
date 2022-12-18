/**
 * Error subclass throwed when the linking of a WebGLProgram on a
 * WebGL2RenderingContext fails due to a WebGLShader compilation error.
 * 
 * @constructor
 * @extends Error
 * @param {string} message Shader info log
 * @param {number} type Shader type (`VERTEX_SHADER` or `FRAGMENT_SHADER`)
 */
export function ShaderCompilationError(message, type) {
	if (!(this instanceof ShaderCompilationError)) return new ShaderCompilationError(message, type);

	this.message = `${shaderTypes[type]} SHADER ${message}`;
	this.stack = Error().stack;
	this.display = function() {
		const div = document.createElement("div");

		div.classList.add("error");
		div.append(this.message);

		document.body.appendChild(div);
	};
}

ShaderCompilationError.prototype = Error.prototype;
ShaderCompilationError.prototype.name = "ShaderCompilationError";

const shaderTypes = {
	35632: "FRAGMENT",
	35633: "VERTEX",
};