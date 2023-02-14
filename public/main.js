// import {Group, Image, ImageButton} from "src/gui";
import Instance from "src/instance";
// import {Vector2} from "src/math";
import GUI from "./extensions/GUI.js";
import GUIRenderer from "./extensions/GUIRenderer.js";
import MainMenuLayer from "./extensions/MainMenuLayer.js";

/** @type {Instance} */
const instance = new Instance();

/** @type {GUI} */
export let gui;

try {
	instance.build();
	await instance.initialize();

	gui = new GUI(instance, new GUIRenderer());

	await instance.setupRenderers([gui]);

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await gui.renderer.loadTextures(guiTextures, instance.texturePath);

	// let counter = 0;

	/* const tree = [
		new Group({
			align: ["center", "center"],
			margin: new Vector2(0, 0),
			size: new Vector2(200, 96),
			children: [
				new ImageButton({
					align: ["left", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: gui.renderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 146),
					onMouseEnter: function() {
						const newUv = this.getUV();
						newUv.y = 166;
						this.setUV(newUv);

						gui.renderQueue.push(this);
						gui.render();
					},
					onMouseLeave: function() {
						const newUv = this.getUV();
						newUv.y = 146;
						this.setUV(newUv);

						gui.renderQueue.push(this);
						gui.render();
					},
					onMouseDown: () => console.log(++counter),
				}),
				new ImageButton({
					align: ["right", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: gui.renderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["left", "bottom"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: gui.renderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["right", "bottom"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: gui.renderer.textures["gui/widgets.png"],
					uv: new Vector2(0, 186),
				}),
			],
		}),
		new Image({
			align: ["right", "bottom"],
			margin: new Vector2(10, 10),
			size: new Vector2(20, 20),
			image: gui.renderer.textures["gui/widgets.png"],
			uv: new Vector2(0, 106),
		}),
	]; */

	gui.push(new MainMenuLayer());
	gui.computeTree();
	gui.render();

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}