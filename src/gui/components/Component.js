/**
 * @todo Summary
 * 
 * @constructor
 * @param {object} options
 * @param {Vector2} options.position
 */
export default function Component({position}) {
	/** @type {Vector2} */
	this.position = position;

	/**
	 * This method is called by the GUI renderer at draw time.
	 * NOTE: Must be overridden in an instance.
	 * 
	 * @method
	 * @param {WebGL2RenderingContext} gl
	 */
	this.render = null;
}