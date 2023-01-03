import {NoWebGL2Error, ShaderCompilationError} from "src/errors";
import {Vector2, clampDown, clampUp, intersects} from "src/math";
import Renderer from "./Renderer.js";

/**
 * @todo Apply settings
 * @todo Implement render pipeline here
 * @todo JSDoc for private properties?
 * @todo Viewport size Vector2?
 * 
 * Game instance.
 * This holds information about asset base paths, viewport dimensions and GUI scale.
 * 
 * @constructor
 */
export default function Instance() {
	const DEFAULT_WIDTH = 320;
	const DEFAULT_HEIGHT = 240;
	const RESIZE_DELAY = 50;

	/**
	 * Prevents the first `ResizeObserver` call.
	 * 
	 * @type {?Boolean}
	 */
	let isFirstResize = true;

	/**
	 * Timeout ID of the `ResizeObserver`, used to clear the timeout.
	 * 
	 * @type {Number}
	 */
	let resizeTimeoutID;

	/**
	 * Animation request ID, used to interrupt the loop.
	 * 
	 * @type {Number}
	 */
	let animationRequestID;

	/**
	 * Returns `true` if the instance canvas has been added to the DOM, `false` otherwise.
	 * 
	 * @type {Boolean}
	 */
	let hasBeenBuilt = false;

	let rendererLength;

	let mouseEnterListeners = [];
	let mouseEnterListenerCount = 0;

	let mouseLeaveListeners = [];
	let mouseLeaveListenerCount = 0;

	let mouseDownListeners = [];
	let mouseDownListenerCount = 0;

	/** @type {?HTMLCanvasElement} */
	let canvas;

	/** @type {?WebGL2RenderingContext} */
	let gl;

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
	 * @type {?String}
	 */
	this.shaderPath = "assets/shaders/";

	/**
	 * Texture folder path, relative to the root folder.
	 * 
	 * @type {?String}
	 */
	this.texturePath = "assets/textures/";

	/**
	 * @todo Define null first?
	 * 
	 * Cached values of `window.innerWidth` and `window.innerHeight`.
	 * 
	 * @type {Vector2}
	 */
	const viewportSize = new Vector2(innerWidth, innerHeight);

	/**
	 * Current GUI scale multiplier.
	 * Determines the scale of the crosshair and most of the GUI components.
	 * 
	 * @type {?Number}
	 */
	this.currentScale = 2;

	/**
	 * @todo Since this is controlled by the user, move it to a public class?
	 * 
	 * GUI scale multiplier chosen by the user.
	 * 
	 * @type {?Number}
	 */
	this.desiredScale = 2;

	/**
	 * Maximum GUI scale multiplier appliable to the current viewport.
	 * This caps the desired scale multiplier.
	 * 
	 * @type {?Number}
	 */
	this.maxScale = 4;

	/**
	 * Current position of the pointer, used for GUI event listeners.
	 * 
	 * @type {?Vector2}
	 */
	let pointerPosition;

	/**
	 * @todo Finish implementing
	 * 
	 * @throws {NoWebGL2Error}
	 */
	this.build = function() {
		canvas = document.createElement("canvas");
		canvas.width = viewportSize.x;
		canvas.height = viewportSize.y;
		gl = canvas.getContext("webgl2");

		if (gl === null) throw NoWebGL2Error();

		this.resizeObserver = new ResizeObserver(([entry]) => {
			// Avoid the first resize
			if (isFirstResize) return isFirstResize = null;

			clearTimeout(resizeTimeoutID);
			resizeTimeoutID = setTimeout(() => {
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
			}, RESIZE_DELAY);
		});

		document.body.appendChild(canvas);

		hasBeenBuilt = true;

		try {
			this.resizeObserver.observe(canvas, {
				box: "device-pixel-content-box",
			});
		} catch (error) {
			// "device-pixel-content-box" isn't defined, try with "content-box"
			this.resizeObserver.observe(canvas, {
				box: "content-box",
			});
		}

		canvas.addEventListener("mousemove", mouseMoveListener.bind(this));
		canvas.addEventListener("mousedown", mouseDownListener.bind(this));
	};

	this.hasBeenBuilt = () => hasBeenBuilt;

	/**
	 * Setups the instance renderers.
	 * 
	 * @param {Renderer[]} renderers
	 */
	this.setupRenderers = function(renderers) {
		const {rendererTextures} = this;
		let texture;

		rendererLength = renderers.length;

		for (let i = 0; i < rendererLength; i++) {
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
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} dpr
	 */
	this.resize = function(width, height, dpr) {
		gl.viewport(
			0,
			0,
			/** @todo Set viewport size as multiples of 2? */
			canvas.width = viewportSize.x = /* (width / 2 | 0) * 2 */ width * dpr | 0,
			canvas.height = viewportSize.y = /* (height / 2 | 0) * 2 */ height * dpr | 0,
		);

		// Calculate scale multiplier
		let i = 1;
		while (
			viewportSize.x > DEFAULT_WIDTH * i &&
			viewportSize.y > DEFAULT_HEIGHT * i
		) i++;

		const currentScale = clampUp(
			this.desiredScale,
			this.maxScale = clampDown(i - 1, 1),
		);

		this.currentScale = currentScale;

		for (let i = 0; i < rendererLength; i++) this.renderers[i].resize();
	};

	/**
	 * @todo `gl.RGB` or `gl.RGBA`?
	 * 
	 * @param {Number} index
	 * @param {OffscreenCanvas} canvas
	 */
	this.updateRendererTexture = function(index, canvas) {
		const {rendererTextures} = this;

		gl.bindTexture(gl.TEXTURE_2D, rendererTextures[index]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	};

	/**
	 * @todo Better naming
	 * 
	 * Starts the game loop.
	 */
	this.startLoop = () => this.loop();

	/**
	 * @todo Better naming
	 * 
	 * Game loop.
	 */
	this.loop = function() {
		animationRequestID = requestAnimationFrame(this.loop);

		this.render();
	}.bind(this);

	/**
	 * @todo Better naming
	 * 
	 * Stops the game loop.
	 */
	this.stopLoop = () => cancelAnimationFrame(animationRequestID);

	/**
	 * @todo Use `Renderer` class to avoid duplicate methods (createProgram/createShader/linkProgram)?
	 * @async
	 */
	this.initialize = async function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		const [program, vertexShader, fragmentShader] = await createProgram(this.shaderPath, [
			"main.vert",
			"main.frag",
		]);

		linkProgram(program, vertexShader, fragmentShader);

		gl.useProgram(program);

		Object.assign(gl, {
			attribute: {},
			buffer: {},
			uniform: {},
		});

		gl.attribute.position = 0;
		gl.buffer.position = gl.createBuffer();

		gl.enableVertexAttribArray(gl.attribute.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1,  1,
		   -1,  1,
		   -1, -1,
			1, -1,
		]), gl.STATIC_DRAW);
	};

	/**
	 * @todo Instanced drawing with multiple textures
	 */
	this.render = function() {
		const {rendererTextures} = this;

		for (let i = 0; i < rendererLength; i++) {
			if (this.renderers[i].disabled) continue;

			gl.bindTexture(gl.TEXTURE_2D, rendererTextures[i]);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		}
	};

	this.dispose = function() {
		if (!(gl instanceof WebGL2RenderingContext)) {
			return console.info("This exception occurred before building the instance.");
		}

		/** @todo Stop the game loop if it has started */

		// Dispose child renderers
		for (let i = 0; i < rendererLength; i++) this.renderers[i].dispose();

		/** @todo Dispose the output context */

		// Remove the resize observer
		this.resizeObserver.unobserve(canvas);

		// Remove the output canvas from the DOM
		canvas.remove();
		canvas = null;

		return console.info("The instance was properly disposed after catching this exception.");
	};

	this.addMouseDownListener = function(listener) {
		mouseDownListeners.push(listener);
		mouseDownListenerCount++;
	};

	this.addMouseEnterListener = function(listener) {
		mouseEnterListeners.push(listener);
		mouseEnterListenerCount++;
	};

	this.addMouseLeaveListener = function(listener) {
		mouseLeaveListeners.push(listener);
		mouseLeaveListenerCount++;
	};

	/**
	 * Manager for the `mouseenter` and `mouseleave` events.
	 * 
	 * @param {{x: Number, y: Number}}
	 */
	function mouseMoveListener({clientX: x, clientY: y}) {
		pointerPosition = new Vector2(x, y).divideScalar(this.currentScale);
		let i, listener;

		for (i = 0; i < mouseEnterListenerCount; i++) {
			listener = mouseEnterListeners[i];

			if (!intersects(pointerPosition, listener.component.getPosition(), listener.component.getSize())) continue;
			if (listener.component.isHovered()) continue;

			listener.component.setIsHovered(true);
			listener(pointerPosition);
		}

		for (i = 0; i < mouseLeaveListenerCount; i++) {
			listener = mouseLeaveListeners[i];

			if (intersects(pointerPosition, listener.component.getPosition(), listener.component.getSize())) continue;
			if (!listener.component.isHovered()) continue;

			listener.component.setIsHovered(false);
			listener(pointerPosition);
		}
	}

	/**
	 * Manager for the `mousedown` event.
	 */
	function mouseDownListener() {
		for (let i = 0, listener; i < mouseDownListenerCount; i++) {
			listener = mouseDownListeners[i];

			if (!intersects(pointerPosition, listener.component.getPosition(), listener.component.getSize())) return;

			listener(pointerPosition);
		}
	}

	/** @todo Remove duplicate util */
	async function createProgram(basePath, [vertexPath, fragmentPath]) {
		const
			program = gl.createProgram(),
			vertexShader = await createShader(basePath, vertexPath, gl.VERTEX_SHADER),
			fragmentShader = await createShader(basePath, fragmentPath, gl.FRAGMENT_SHADER);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		return [program, vertexShader, fragmentShader];
	}

	/** @todo Remove duplicate util */
	async function createShader(base, path, type) {
		const
			shader = gl.createShader(type),
			source = await (await fetch(`${base}${path}`)).text();

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		return shader;
	}

	/** @todo Remove duplicate util */
	function linkProgram(program, vertexShader, fragmentShader) {
		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) return;

		let log;

		if ((log = gl.getShaderInfoLog(vertexShader)).length !== 0) {
			throw ShaderCompilationError(log, gl.VERTEX_SHADER);
		}

		if ((log = gl.getShaderInfoLog(fragmentShader)).length !== 0) {
			throw ShaderCompilationError(log, gl.FRAGMENT_SHADER);
		}
	}

	this.getViewportSize = () => viewportSize;
}