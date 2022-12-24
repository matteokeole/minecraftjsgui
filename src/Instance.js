import {NoWebGL2Error, ShaderCompilationError} from "errors";
import {Vector2, clampDown, clampUp, intersects} from "math";

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
	let rendererLength;

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
	 * Current position of the pointer.
	 * Used for GUI event listeners.
	 * 
	 * @type {Vector2}
	 */
	this.pointerPosition = new Vector2(0, 0);

	/**
	 * List of registered `mousemove` events.
	 * 
	 * @type {Function[]}
	 */
	this.mouseMoveEvents = [];
	this.mouseMoveEventCount = 0;

	/**
	 * List of registered `mousedown` events.
	 * 
	 * @type {Function[]}
	 */
	 this.mouseDownEvents = [];
	 this.mouseDownEventCount = 0;

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

		this.output.addEventListener("mousemove", mouveMoveListener.bind(this));
		this.output.addEventListener("mousedown", mouveDownListener.bind(this));
	};

	/**
	 * Setups the instance renderers.
	 * 
	 * @param {Renderer[]} renderers
	 */
	this.setupRenderers = function(renderers) {
		const {gl, rendererTextures} = this;
		let texture;

		rendererLength = renderers.length;

		for (let i = 0; i < rendererLength; i++) {
			renderers[i].instance = this;

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
		const {output, gl} = this;

		/** @todo Set viewport size as multiples of 2? */
		this.viewportWidth = /* (width / 2 | 0) * 2 */ width * dpr | 0;
		this.viewportHeight = /* (height / 2 | 0) * 2 */ height * dpr | 0;
		this.devicePixelRatio = dpr;

		output.width = this.viewportWidth;
		output.height = this.viewportHeight;

		gl.viewport(0, 0, output.width, output.height);

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

		this.currentScale = currentScale;

		for (let i = 0; i < rendererLength; i++) {
			this.renderers[i].resize();
		}
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

	this.initialize = async function() {
		const {gl} = this;

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		/** @todo load `main` program */
		const [program, vertexShader, fragmentShader] = await createProgram(gl, this.shaderPath, [
			"main.vert",
			"main.frag",
		]);

		linkProgram(gl, program, vertexShader, fragmentShader);

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
     * @todo Implement
     */
	this.render = function() {
		const {gl, rendererTextures} = this;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (let i = 0; i < rendererLength; i++) {
			gl.bindTexture(gl.TEXTURE_2D, rendererTextures[i]);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		}
	};

	/**
	 * @todo Implement
	 */
	this.dispose = function() {
		// Dispose offscreen renderers
		for (let i = 0; i < rendererLength; i++) {
			renderers[i].dispose();
		}

		/** @todo Dispose the output context */
		this.canvas.remove();
		this.canvas = null;
	};

	this.addMouseMoveListener = function(callback) {
		this.mouseMoveEvents.push(callback);
		this.mouseMoveEventCount++;
	};

	this.addMouseDownListener = function(callback) {
		this.mouseDownEvents.push(callback);
		this.mouseDownEventCount++;
	};

	function mouveMoveListener({clientX: x, clientY: y}) {
		let event;

		this.pointerPosition.x = x;
		this.pointerPosition.y = y;
		this.pointerPosition = this.pointerPosition.divideScalar(this.currentScale);

		for (let i = 0; i < this.mouseMoveEventCount; i++) {
			event = this.mouseMoveEvents[i];

			if (!intersects(this.pointerPosition, event.component.position, event.component.size)) return;

			event(this.pointerPosition);
		}
	}

	function mouveDownListener() {
		let event;

		for (let i = 0; i < this.mouseDownEventCount; i++) {
			event = this.mouseDownEvents[i];

			if (!intersects(this.pointerPosition, event.component.position, event.component.size)) return;

			event(this.pointerPosition);
		}
	}
}













/** @todo remove duplicate utils */
async function createProgram(gl, basePath, [vertexPath, fragmentPath]) {
	const
		program = gl.createProgram(),
		vertexShader = await createShader(gl, basePath, vertexPath, gl.VERTEX_SHADER),
		fragmentShader = await createShader(gl, basePath, fragmentPath, gl.FRAGMENT_SHADER);

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	return [program, vertexShader, fragmentShader];
};

async function createShader(gl, base, path, type) {
	const
		shader = gl.createShader(type),
		source = await (await fetch(`${base}${path}`)).text();

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	return shader;
};

function linkProgram(gl, program, vertexShader, fragmentShader) {
	gl.linkProgram(program);

	if (gl.getProgramParameter(program, gl.LINK_STATUS)) return;

	let log;

	if ((log = gl.getShaderInfoLog(vertexShader)).length !== 0) {
		throw ShaderCompilationError(log, gl.VERTEX_SHADER);
	}

	if ((log = gl.getShaderInfoLog(fragmentShader)).length !== 0) {
		throw ShaderCompilationError(log, gl.FRAGMENT_SHADER);
	}
};