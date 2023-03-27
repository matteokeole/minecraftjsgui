import Instance from "src/instance";
import {GUI, GUIRenderer} from "src/gui";
// import MainMenuLayer from "./layers/MainMenuLayer.js";
import TestLayer from "./layers/TestLayer.js";

/** @todo Fix undefined instance on throw */

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
	const textures = await (await fetch("assets/textures/textures.json")).json();

	gui.renderer.createTextureArray(textures.length + 3);

	await gui.renderer.loadTextures(textures, instance.texturePath);
	await gui.renderer.loadTestTextures();

	gui.push(new TestLayer());

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}