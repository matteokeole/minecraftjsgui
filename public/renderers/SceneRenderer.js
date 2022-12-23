import Renderer from "renderer";
import GUIRenderer from "./GUIRenderer.js";
import {instance} from "../main.js";

/**
 * Scene renderer singleton.
 * 
 * @constructor
 * @extends Renderer
 */
function SceneRenderer() {
	if (SceneRenderer._instance) return SceneRenderer._instance;

	Renderer.call(this, {
		offscreen: false,
		generateMipmaps: true,
	});

	SceneRenderer._instance = this;

	this.init = async function() {
		const {canvas, gl} = this;

		// Context configuration
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // For GUI transparency

		// Load GUI program
		const [program, vertexShader, fragmentShader] = await this.createProgram([
			"gui.vert",
			"gui.frag",
		]);

		this.linkProgram(program, vertexShader, fragmentShader);

		gl.useProgram(program);

		gl.attribute.position = 0;
		gl.buffer.position = gl.createBuffer();
		gl.texture.gui = gl.createTexture();

		gl.bindVertexArray(gl.vao.main);

		gl.enableVertexAttribArray(gl.attribute.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);

		// GUI texture vertices
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1,  1,
		   -1,  1,
		   -1, -1,
			1, -1,
		]), gl.STATIC_DRAW);

		// GUI texture configuration
		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Don't generate mipmaps

		// Bind the ResizeObserver to the SceneRenderer canvas
		try {
			resizeObserver.observe(canvas, {
				box: "device-pixel-content-box",
			});
		} catch (error) {
			// "device-pixel-content-box" isn't defined, try with "content-box"
			resizeObserver.observe(canvas, {
				box: "content-box",
			});
		}
	};

	this.render = function() {
		const {gl} = this;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	};

	/**
	 * Updates the GUI texture with the provided canvas.
	 * 
	 * @param {OffscreenCanvas} canvas
	 */
	this.updateGUITexture = function(canvas) {
		const {gl} = this;

		gl.bindTexture(gl.TEXTURE_2D, gl.texture.gui);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	};
}

SceneRenderer.prototype = Object.create(Renderer.prototype, {
	constructor: {
		value: SceneRenderer,
	},
});

const sceneRenderer = new SceneRenderer();

/** @todo Append to the instance instead of the scene renderer */
const resizeObserver = new ResizeObserver(function([entry]) {
	if (_firstResize) return _firstResize = false;

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

	instance.resize(width, height, dpr);
	GUIRenderer.resize();
	sceneRenderer.resize();
});

let _firstResize = true;

export default sceneRenderer;