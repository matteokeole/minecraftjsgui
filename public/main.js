import {Group, Image, ImageButton} from "src/gui";
import Instance from "src/instance";
import {Vector2} from "src/math";
import GUIRenderer from "./extensions/GUIRenderer.js";
import {OrthographicCamera} from "src/cameras";

export const instance = new Instance();

/** @type {GUIRenderer} */
export let guiRenderer;

const guiCamera = new OrthographicCamera();

try {
	instance.build();
	await instance.initialize();

	guiRenderer = new GUIRenderer(instance);

	await instance.setupRenderers([guiRenderer]);

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await guiRenderer.loadTextures(guiTextures, instance.texturePath);

	let counter = 0;

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
					image: guiRenderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 146),
					onMouseEnter: function() {
						const newUv = this.getUV();
						newUv.y = 166;
						this.setUV(newUv);

						guiRenderer.renderQueue.push(this);
						guiRenderer.render(instance);
					},
					onMouseLeave: function() {
						const newUv = this.getUV();
						newUv.y = 146;
						this.setUV(newUv);

						guiRenderer.renderQueue.push(this);
						guiRenderer.render(instance);
					},
					onMouseDown: function() {
						counter++;
						console.log(counter);
					},
				}),
				new ImageButton({
					align: ["right", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["left", "bottom"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["right", "bottom"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 186),
				}),
			],
		}),
		new Image({
			align: ["right", "bottom"],
			margin: new Vector2(10, 10),
			size: new Vector2(20, 20),
			image: guiRenderer.textures["gui/widgets.png"],
			uv: new Vector2(0, 106),
		}),
	];

	guiRenderer.setComponentTree(tree, instance);
	guiRenderer.computeTree(instance);
	guiRenderer.render(instance);

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}