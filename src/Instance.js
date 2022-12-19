export default new function Instance() {
	/** @type {string} */
	let shaderPath;

	/** @type {string} */
	let texturePath;

	/** @type {number} */
	let devicePixelRatio = 1;

	/** @type {number} */
	let viewportWidth = innerWidth;

	/** @type {number} */
	let viewportHeight = innerHeight;

	/**
	 * Returns the shader path.
	 */
	this.getShaderPath = () => shaderPath;

	/**
	 * Updates the shader path with the provided value.
	 * 
	 * @param {string} path
	 */
	this.setShaderPath = path => shaderPath = path;

	/**
	 * Returns the texture path.
	 */
	this.getTexturePath = () => texturePath;

	/**
	 * Updates the texture path with the provided value.
	 * 
	 * @param {string} path
	 */
	this.setTexturePath = path => texturePath = path;

	/**
	 * Returns the viewport width.
	 */
	this.getDevicePixelRatio = () => devicePixelRatio;

	/**
	 * Returns the viewport width.
	 */
	this.getViewportWidth = () => viewportWidth;

	/**
	 * Returns the viewport height.
	 */
	this.getViewportHeight = () => viewportHeight;

	/**
	 * Updates the device pixel ratio with the provided value.
	 * 
	 * @param {number} dpr
	 */
	this.setDevicePixelRatio = dpr => devicePixelRatio = dpr;

	/**
	 * Updates the viewport width with the provided value.
	 * The width is multiplied by the device pixel ratio and rounded down.
	 * 
	 * @param {number} width
	 */
	this.setViewportWidth = width => viewportWidth = width * devicePixelRatio | 0;

	/**
	 * Updates the viewport height with the provided value.
	 * The height is multiplied by the device pixel ratio and rounded down.
	 * 
	 * @param {number} height
	 */
	this.setViewportHeight = height => viewportHeight = height * devicePixelRatio | 0;
}