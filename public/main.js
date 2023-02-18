import Instance from "src/instance";
import GUI from "./gui/GUI.js";
import GUIRenderer from "./gui/GUIRenderer.js";
import MainMenuLayer from "./gui/layers/MainMenuLayer.js";

/** @todo Fix undefined instance on catch */

/** @type {GUI} */
export let gui;

try {
	/** @type {Instance} */
	const instance = new Instance();

	gui = new GUI(instance, new GUIRenderer());

	instance.build();
	await instance.initialize();
	await instance.setupRenderers([gui]);

	// Load GUI textures and test color textures
	await gui.renderer.loadTestTextures(
		await (await fetch("assets/textures/textures.json")).json(),
		instance.texturePath,
	);

	gui.push(new MainMenuLayer());
	gui.computeTree();
	gui.render();

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}