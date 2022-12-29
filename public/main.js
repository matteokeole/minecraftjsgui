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

	/* const group = new Group({
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
	}); */

	const button1 = new ImageButton({
		align: ["left", "top"],
		margin: new Vector2(10, 10),
		size: new Vector2(20, 20),
		image: guiRenderer.getTexture("gui/widgets.png"),
		uv: new Vector2(0, 106),
		onMouseEnter: function() {
			const uv = new Vector2(0, 126);

			this.setUV(uv);

			// Register to the render stack
			this.pushToRenderStack();

			// Render
			guiRenderer.render();
		},
		onMouseLeave: function() {
			const uv = new Vector2(0, 106);

			this.setUV(uv);

			// Register to the render stack
			this.pushToRenderStack();

			// Render
			guiRenderer.render();
		},
	});

	const button2 = new ImageButton({
		align: ["left", "top"],
		margin: new Vector2(32, 10),
		size: new Vector2(20, 20),
		image: guiRenderer.getTexture("gui/widgets.png"),
		uv: new Vector2(0, 146),
		onMouseEnter: function() {
			const uv = new Vector2(0, 166);

			this.setUV(uv);

			// Register to the render stack
			this.pushToRenderStack();

			// Render
			guiRenderer.render();
		},
		onMouseLeave: function() {
			const uv = new Vector2(0, 146);

			this.setUV(uv);

			// Register to the render stack
			this.pushToRenderStack();

			// Render
			guiRenderer.render();
		},
	});

	const button3 = new ImageButton({
		align: ["left", "top"],
		margin: new Vector2(53, 10),
		size: new Vector2(20, 20),
		image: guiRenderer.getTexture("gui/widgets.png"),
		uv: new Vector2(0, 186),
	});

	guiRenderer.add(button1, button2, button3);
	guiRenderer.compute();
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (instance.hasBeenBuilt()) instance.dispose();

	error.display?.();

	console.error("An error occurred:", error);
}