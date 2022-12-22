// This is an example file for testing the structure of the next features.

import instance from "instance";
import animationRenderer from "animation-renderer";
import guiRenderer from "gui-renderer";
import hudRenderer from "hud-renderer";
import particleRenderer from "particle-renderer";
import sceneRenderer from "scene-renderer";
import skyboxRenderer from "skybox-renderer";

// Set instance options
const options = new InstanceOptions({
	"monochrome-logo": true,
});

instance.setOptions(options);

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

		// Load program
		gl.attribute.position = 0;
		gl.buffer.position = gl.createBuffer();

		gl.useProgram(program);

		gl.enableVertexAttribArray(gl.attribute.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer.position);
		gl.vertexAttribPointer(gl.attribute.position, 2, gl.FLOAT, false, 0, 0);

		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				1,  1,
			   -1,  1,
			   -1, -1,
				1, -1,
			]),
			gl.STATIC_DRAW,
		);
	},
);

// Create the render pipeline function
instance.setPipeline(
	/**
	 * @param {WebGL2RenderingContext} gl Instance context
	 * @param {Object<string, Renderer>} renderers Renderers bound to the instance
	 */
	function(gl, renderers) {
		// Draw instanced renderer textures with the instance context
		// - Texture array
		// - Draw each texture above the others, on the same plane
		/** @todo */

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