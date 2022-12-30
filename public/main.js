import {NoWebGL2Error} from "src/errors";
import {Group, ImageButton} from "src/gui";
import {Vector2} from "src/math";
import Instance from "src/instance";
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

	const tree = [
		new Group({
			align: ["center", "center"],
			margin: new Vector2(0, 0),
			size: new Vector2(200, 96),
			children: [
				new ImageButton({
					align: ["left", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["right", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["left", "bottom"],
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
		}),
		new ImageButton({
			align: ["right", "bottom"],
			margin: new Vector2(10, 10),
			size: new Vector2(20, 20),
			image: guiRenderer.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 186),
		}),
	];

	guiRenderer.setComponentTree(tree);
	guiRenderer.computeTree();
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (instance.hasBeenBuilt()) instance.dispose();

	error.display?.();

	console.error("An error occurred:", error);
}