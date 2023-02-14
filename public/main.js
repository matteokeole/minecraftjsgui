import Instance from "src/instance";
import GUI from "./extensions/GUI.js";
import GUIRenderer from "./extensions/GUIRenderer.js";
import MainMenuLayer from "./extensions/MainMenuLayer.js";

/** @type {GUI} */
export let gui;

try {
	/** @type {Instance} */
	const instance = new Instance();

	gui = new GUI(instance, new GUIRenderer());

	instance.build();
	await instance.initialize();
	await instance.setupRenderers([gui]);

	// Load GUI textures
	await gui.renderer.loadTextures(
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