import {NoWebGL2Error} from "src/errors";
import {Button, Component, Group, Image, ImageButton} from "src/gui";
import {Vector2} from "src/math";
import Instance from "src/instance";
import GUIRenderer from "./extensions/GUIRenderer.js";

export const instance = new Instance();
export let guiRenderer;

try {
	/** @todo Fix Error referencing to ShaderCompilationError */
	// throw Error();

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
				new Button({
					align: ["right", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(200, 20),
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
		new Image({
			align: ["right", "bottom"],
			margin: new Vector2(0, 0),
			size: new Vector2(20, 20),
			image: guiRenderer.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 106),
		}),
	];

	guiRenderer.setComponentTree(tree);
	guiRenderer.computeTree();
	guiRenderer.render();

	instance.startLoop();
} catch (error) {
	/** @todo First line blank on this log */
	console.error(error);

	instance.dispose();

	// Append custom error node
	if ("node" in error) document.body.appendChild(error.node);
}