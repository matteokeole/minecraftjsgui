import {NoWebGL2Error} from "errors";
import {Image, ImageButton} from "gui";
import {Vector2} from "math";
import Instance from "instance";
import GUIRenderer from "./extensions/GUIRenderer.js";

export const instance = new Instance();
export let guiRenderer;

try {
	instance.build();
	await instance.initialize();

	instance.setupRenderers([
		guiRenderer = new GUIRenderer(instance),
	]);

	guiRenderer.build();

	await guiRenderer.init();

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await guiRenderer.loadTextures(guiTextures);

	/* const image = new Image({
		align: ["left", "top"],
		margin: new Vector2(0, 0),
		size: new Vector2(256, 256),
		image: guiRenderer.textures["gui/widgets.png"],
		uv: new Vector2(0, 0), // 146
	}); */

	const btn = new ImageButton({
		align: ["left", "top"],
		margin: new Vector2(20, 20),
		size: new Vector2(20, 20),
		image: guiRenderer.textures["gui/widgets.png"],
		uv: new Vector2(0, 146),
	});

	guiRenderer.add(btn);
	guiRenderer.compute();
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (!(error instanceof NoWebGL2Error)) instance.dispose();

	error.display?.();

	console.error("An error occurred:", error);
}