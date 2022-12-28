import {Group, ImageButton} from "gui";
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

	const group = new Group({
		align: ["center", "top"],
		margin: new Vector2(0, 0),
		size: new Vector2(100, 100),
		children: [
			new ImageButton({
				align: ["left", "top"],
				margin: new Vector2(0, 0),
				size: new Vector2(20, 20),
				image: guiRenderer.getTexture("gui/widgets.png"),
				uv: new Vector2(0, 186),
			}),
			new ImageButton({
				align: ["right", "bottom"],
				margin: new Vector2(0, 0),
				size: new Vector2(20, 20),
				image: guiRenderer.getTexture("gui/widgets.png"),
				uv: new Vector2(0, 186),
			}),
		],
	});

	const button = new ImageButton({
		align: ["left", "top"],
		margin: new Vector2(54, 10),
		size: new Vector2(20, 20),
		image: guiRenderer.getTexture("gui/widgets.png"),
		uv: new Vector2(0, 186),
	});

	guiRenderer.add(group, button);
	guiRenderer.compute();
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (instance.hasBeenBuilt()) instance.dispose();

	error.display?.();

	console.error("An error occurred:", error);
}