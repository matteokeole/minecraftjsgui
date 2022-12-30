// This is an example file for testing the structure of the next features.

import instance from "./main.js";
import animationRenderer from "./animation-renderer.js";
import guiRenderer from "./gui-renderer.js";
import hudRenderer from "./hud-renderer.js";
import particleRenderer from "./particle-renderer.js";
import sceneRenderer from "./scene-renderer.js";
import skyboxRenderer from "./skybox-renderer.js";

// Create an instance option
const monochromeLogo = new Option({
	name: "monochrome-logo",
	validator: function(value) {
		if (typeof value !== "boolean") return false;

		return true;
	},
	defaultValue: false,
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