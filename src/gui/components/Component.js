export default function Component() {
	/**
	 * @type {{x: number, y: number}[]}
	 */
	this.position = null;

	/**
	 * This function is called by the GUI renderer at draw time.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @param {WebGL2RenderingContext} gl
	 */
	this.register = null;
}