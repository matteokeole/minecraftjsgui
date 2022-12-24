import {NoWebGL2Error} from "errors";
import {Image} from "gui";
import {Vector2} from "math";
import Instance from "instance";
import GUIRenderer from "./renderers/GUIRenderer.js";

export const instance = new Instance();
export let guiRenderer;

try {
	instance.build();
	await instance.initialize();

	instance.setRenderers([
		guiRenderer = new GUIRenderer(instance),
	]);

	guiRenderer.build();

	await guiRenderer.init();

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await guiRenderer.loadTextures(guiTextures);

	const image = new Image({
		align: ["right", "top"],
		margin: new Vector2(0, 40),
		size: new Vector2(20, 20),
		image: guiRenderer.textures["gui/widgets.png"],
		uv: new Vector2(0, 146),
	});

	guiRenderer.add(image);
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (!(error instanceof NoWebGL2Error)) instance.dispose();

	error.display?.();

	console.error("An error occurred:", error);
}