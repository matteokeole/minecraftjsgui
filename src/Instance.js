import {NoWebGL2Error} from "errors";
import {clampDown, clampUp} from "math";
import Texture from "./Texture.js";

/**
 * @todo Apply settings
 * @todo Implement render pipeline here
 * 
 * Game instance.
 * This holds information about asset base paths, viewport dimensions and GUI scale.
 * 
 * @constructor
 */
export default function Instance() {
	const DEFAULT_WIDTH = 320;
	const DEFAULT_HEIGHT = 240;
	let firstResize = true,
		request,
		fps = 10,
		interval = 1000 / fps,
		then,
		now,
		diff;

	/**
	 * HTMLCanvas output.
	 * 
	 * @type {?HTMLCanvasElement}
	 */
	this.output = null;

	/**
	 * Offscreen renderers.
	 * 
	 * @type {Renderer[]}
	 */
	this.renderers = [];

	/**
	 * Textures for each offscreen renderer.
	 * 
	 * @type {WebGLTexture[]}
	 */
	 this.rendererTextures = [];

	/**
	 * Shader folder path, relative to the root folder.
	 * 
	 * @type {?string}
	 */
	this.shaderPath = "assets/shaders/";

	/**
	 * Texture folder path, relative to the root folder.
	 * 
	 * @type {?string}
	 */
	this.texturePath = "assets/textures/";

	/**
	 * Cached value of window.devicePixelRatio.
	 * 
	 * @type {?number}
	 */
	this.devicePixelRatio = null;

	/**
	 * Cached value of window.innerWidth.
	 * 
	 * @type {?number}
	 */
	this.viewportWidth = innerWidth;

	/**
	 * Cached value of window.innerHeight.
	 * 
	 * @type {?number}
	 */
	this.viewportHeight = innerHeight;

	/**
	 * @todo Since this is controlled by the user, move it to a public class?
	 * 
	 * GUI scale multiplier chosen by the user.
	 * 
	 * @type {?number}
	 */
	this.desiredScale = 2;

	/**
	 * Current GUI scale multiplier.
	 * Determines the scale of the crosshair and most of the GUI components.
	 * 
	 * @type {?number}
	 */
	this.currentScale = 2;

	/**
	 * Maximum GUI scale multiplier appliable to the current viewport.
	 * This caps the desired scale multiplier.
	 * 
	 * @type {?number}
	 */
	this.maxScale = 4;

	/**
	 * @todo Finish implementing
	 * 
	 * @throws {NoWebGL2Error}
	 */
	this.build = function() {
		this.output = document.createElement("canvas");
		this.output.width = this.viewportWidth;
		this.output.height = this.viewportHeight;
		this.gl = this.output.getContext("webgl2");

		if (this.gl === null) throw NoWebGL2Error();

		this.resizeObserver = new ResizeObserver(([entry]) => {
			// Avoid the first resize
			if (firstResize) return firstResize = null;

			let width, height, dpr = 1;

			if (entry.devicePixelContentBoxSize) {
				({inlineSize: width, blockSize: height} = entry.devicePixelContentBoxSize[0]);
			} else {
				dpr = devicePixelRatio;

				if (entry.contentBoxSize) {
					entry.contentBoxSize[0] ?
						({inlineSize: width, blockSize: height} = entry.contentBoxSize[0]) :
						({inlineSize: width, blockSize: height} = entry.contentBoxSize);
				} else ({width, height} = entry.contentRect);
			}

			this.resize(width, height, dpr);
		});

		document.body.appendChild(this.output);

		try {
			this.resizeObserver.observe(this.output, {
				box: "device-pixel-content-box",
			});
		} catch (error) {
			// "device-pixel-content-box" isn't defined, try with "content-box"
			this.resizeObserver.observe(this.output, {
				box: "content-box",
			});
		}
	};

	/**
	 * Setups the instance renderers.
	 * 
	 * @param {Renderer[]} renderers
	 */
	this.setRenderers = function(renderers) {
		const {gl, rendererTextures} = this;
		const {length} = renderers;
		let texture;

		for (let i = 0; i < length; i++) {
			this.renderers.push(renderers[i]);

			gl.bindTexture(gl.TEXTURE_2D, texture = gl.createTexture());
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Don't generate mipmaps

			rendererTextures.push(texture);
		}
	};

	/**
	 * When called, recalculates the max possible GUI scale for the current viewport dimensions
	 * Clamps up the desired scale to the max scale to get the current scale
	 * 
	 * @param {number} width
	 * @param {number} height
	 * @param {number} dpr
	 */
	this.resize = function(width, height, dpr) {
		/** @todo Set viewport size as multiples of 2? */
		this.viewportWidth = /* (width / 2 | 0) * 2 */ width * dpr | 0;
		this.viewportHeight = /* (height / 2 | 0) * 2 */ height * dpr | 0;
		this.devicePixelRatio = dpr;

		this.output.width = this.viewportWidth;
		this.output.height = this.viewportHeight;

		// Calculate scale multiplier
		let i = 1;
		while (
			this.viewportWidth > DEFAULT_WIDTH * i &&
			this.viewportHeight > DEFAULT_HEIGHT * i
		) i++;

		const currentScale = clampUp(
			this.desiredScale,
			this.maxScale = clampDown(i - 1, 1),
		);

		if (currentScale === this.currentScale) return;

		this.currentScale = currentScale;

		/** @todo Redraw the GUI with the new scale here? */
	};

	/**
	 * @todo RGB or RGBA?
	 * 
     * @param {number} index
	 * @param {OffscreenCanvas} canvas
	 */
	this.updateRendererTexture = function(index, canvas) {
		const {gl, rendererTextures} = this;

		gl.bindTexture(gl.TEXTURE_2D, rendererTextures[index]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	};

	/**
	 * Starts the render loop.
	 */
	 this.startLoop = function() {
		then = performance.now();

		this.loop();
	};

	/**
	 * Caller for updates and renders within a render loop.
	 */
	this.loop = function() {
		request = requestAnimationFrame(this.loop);

		diff = (now = performance.now()) - then;

		if (diff > interval) {
			then = now - diff % interval;

			this.render();
		}
	}.bind(this);

	/**
	 * Stops the render loop.
	 */
	this.stopLoop = function() {
		cancelAnimationFrame(request);
	};

	/**
     * @todo Implement
     */
	this.render = () => null;

	/**
	 * @todo Implement
	 */
	this.dispose = () => null;
}