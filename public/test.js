// This is an example file for testing the structure of the next features.

import instance from "./main.js";
import animationRenderer from "./animation-renderer.js";
import guiRenderer from "./gui-renderer.js";
import hudRenderer from "./hud-renderer.js";
import particleRenderer from "./particle-renderer.js";
import sceneRenderer from "./scene-renderer.js";
import skyboxRenderer from "./skybox-renderer.js";

// Create an instance option
const monochromeLogo = new InstanceOption({
	name: "monochrome-logo",
	defaultValue: false,
	validator: function(value) {
		if (typeof value !== "boolean") return false;

		return true;
	},
});

// Set instance options
instance.setOption(monochromeLogo); // To access an option: instance.options["monochrome-logo"]

// Bind the renderers to the current instance
instance.renderers = {
	skybox: skyboxRenderer,
	scene: sceneRenderer,
	particle: particleRenderer,
	hud: hudRenderer,
	gui: animationRenderer,
	scene: guiRenderer,
};

// Create the instance context initializer
instance.setInitializer(
	/**
	 * @param {WebGL2RenderingContext} gl Instance context
	 */
	function(gl) {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		/** @todo load `main` program without using a duplicate Renderer method */

		gl.useProgram(program);

		gl.attribute.position = 0;
		gl.attribute.uv = 0;
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

		gl.enableVertexAttribArray(gl.attribute.uv);
		gl.vertexAttribPointer(gl.attribute.uv, 2, gl.FLOAT, true, 0, 0);
	},
);

// Create the render pipeline function
instance.setPipeline(
	/**
	 * @param {WebGL2RenderingContext} gl Instance context
	 */
	function(gl) {
		// @todo Draw instanced renderer textures with the instance context
		// - Texture array
		// - Draw each texture above the others, on the same plane

		gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, 6);
	},
);








/**
 * Stateful layer draft
 * 
 * Goal: allow dynamic local variables to trigger visual changes,
 * without redrawing non-updated components
 * 
 * Issues:
 * - How to redraw Text components? Compute once static text and compute each time the dynamic part(s)? How to efficiently detect changes in a text?
 */
export default class OptionLayer extends Layer {
	initState(state) {
		state.counter = 0;
	}

	build(state, renderer) {
		return new Group({
			alignment: Alignment.center,
			margin: new Vector2(0, 0),
			size: new Vector2(200, 100),
			children: [
				new Button({
					alignment: Alignment.centerTop,
					margin: new Vector2(0, 0),
					width: 200,
					onClick: function() {
						// State update
						state.counter++;

						// Visual update
						// This only redraws the components registered in the render queue
						renderer.renderQueue.append(this);
						renderer.render();
					},
					child: new Text(state => `Increment counter (${state.counter})`, {
						alignment: Alignment.center,
						margin: new Vector2(0, 0),
					}),
				}),
			],
		});
	}
}















// Game loop test

(() => {
	let lastHeapSize, lastFrameTime;

	function runGame() {
		requestAnimationFrame(runGame);

		const
			heapSize = performance.memory.usedJSHeapSize,
			frameTime = performance.now();

		lastHeapSize ??= heapSize;
		lastFrameTime ??= frameTime;

		const
			dt = frameTime - lastFrameTime,
			dh = heapSize - lastHeapSize;

		frameDataList.push([dt, dh]);

		lastHeapSize = heapSize;
		lastFrameTime = frameTime;

		computeNextGameStateAndPaint();
	}
})();





// Item slot tests
import {Slot} from "src/gui";
import {HelmetItem} from "src/items";
import {Vector2} from "src/math";

const slot = new Slot({
	position: new Vector2(0, 0),
	permanent: true,
	validator: item => item instanceof HelmetItem,
});









/**
 * `WebGLRenderer` class draft
 * 
 * Constraints:
 * - DOM | Offscreen
 * - WebGL1 | WebGL2
 */
import WebGLRenderer from "../src/WebGLRenderer.js";

/**
 * Solution A: Param object
 * 
 * - Asserts required for validating params
 * - Good for presets
 */
const renderer1 = new WebGLRenderer({
	offscreen: false,
	version: 1,
});

const preset = {
	offscreen: true,
	version: 2,
};
const renderer2 = new WebGLRenderer(preset);

/**
 * Solution B: Factories
 * 
 * - No `new` keyword
 * - Aesthetic: nice for offscreen/dom factories, but IMO less for v1/v2 factories
 * - Blocks the use of factories for other things like `fromShaders` factory
 * - Too verbose
 */
WebGLRenderer.offscreen();
WebGLRenderer.dom();
WebGL2Renderer.offscreen();
WebGL2Renderer.dom();
DOMWebGLRenderer.v1();
DOMWebGLRenderer.v2();
OffscreenWebGLRenderer.v1();
OffscreenWebGLRenderer.v2();

/**
 * Solution C: Presets
 * 
 * - Allows to create easily many renderers sharing the same options
 * - Asserts required for validating params
 * - Aesthetic
 */
const customRendererPreset = new WebGLRendererPreset()
	.setOffscreen(true)
	.setVersion(1);

const renderer1 = new WebGLRenderer(customRendererPreset);
const renderer2 = new WebGLRenderer(customRendererPreset);





















export class _GUIRenderer extends WebGLRenderer {
	constructor() {
		super({
			offscreen: true,
			version: 2,
		});

		/**
		 * GUI layer stack. The last layer is the current one.
		 * 
		 * @type {Layer[]}
		 */
		this.layerStack = [];

		/**
		 * Components marked for the next render.
		 * 
		 * @type {Component[]}
		 */
		this.renderQueue = [];
	}

	async build() {}

	registerLayerStackInRenderQueue() {
		for (let i = 0, l = layerStack.length, layer; i < l; i++) {
			layer = layerStack[i];

			this.registerComponentTreeInRenderQueue(layer.tree);
		}
	}

	/** Note: recursive */
	registerComponentTreeInRenderQueue(tree) {
		for (let i = 0, l = tree.length, component; i < l; i++) {
			component = tree[i];

			if (component instanceof Group) continue;

			this.renderQueue.push(component);

			if (component.children?.length !== 0) this.registerComponentTreeInRenderQueue(component.children);
		}
	}
}



/**
 * GUI layer draft.
 */
class MainMenuLayer extends Layer {
	/** @override */
	initState() {
		this.counter = 0;
	}

	/** @override */
	build() {
		return [
			new Button({
				onClick: () => {},
			}),
			new Image({
				image: "gui/widgets.png",
			}),
		];
	}
}



const layer = new Layer({
	initState: function(state) {
		state.counter = 1;

		return state;
	},
	buildTree: function(state) {
		return [
			new Button({
				onClick: function() {
					state.counter++;

					renderer.render();
				},
			}),
			new Image({
				image: "gui/widgets.png",
			}),
		];
	},
});