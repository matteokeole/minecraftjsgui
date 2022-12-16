export default function() {
	/**
	 * This function is called by the renderer at draw time.
	 * All components must override it to add their drawing method.
	 * 
	 * @param {WebGL2RenderingContext} gl
	 */
	this.render = function(gl) {};
}