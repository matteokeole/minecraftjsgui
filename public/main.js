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
	guiRenderer.enable();

	await guiRenderer.init();

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await guiRenderer.loadTextures(...guiTextures);

	const btn = new ImageButton({
		align: ["left", "top"],
		margin: new Vector2(10, 10),
		size: new Vector2(20, 20),
		image: guiRenderer.textures["gui/widgets.png"],
		uv: new Vector2(0, 146),
		onMouseDown: function() {
			this.uv.y = 166;

			this.requestRedraw();
			instance.updateRendererTexture(0, guiRenderer.canvas);
		},
	});

	const inventory = new Image({
		align: ["center", "center"],
		margin: new Vector2(0, 0),
		size: new Vector2(176, 166),
		image: guiRenderer.textures["gui/container/inventory.png"],
		uv: new Vector2(0, 0),
	});

	guiRenderer.add(btn, inventory);
	guiRenderer.compute();
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (!(error instanceof NoWebGL2Error)) instance.dispose();

	error.display?.();

	console.error("An error occurred:", error);
}