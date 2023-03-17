import Instance from "src/instance";
import TextureGenerator from "src/generator";
import Button from "./gui/components/Button.js";
import GUI from "./gui/GUI.js";
import GUIRenderer from "./gui/GUIRenderer.js";
import MainMenuLayer from "./gui/layers/MainMenuLayer.js";

/** @todo Fix undefined instance on throw */

/** @type {GUI} */
export let gui;

/** @type {TextureGenerator} */
export let textureGenerator;

try {
	/** @type {Instance} */
	const instance = new Instance();

	gui = new GUI(instance, new GUIRenderer());
	textureGenerator = new TextureGenerator();

	instance.build();
	await instance.initialize();
	await instance.setupRenderers([gui]);
	await instance.setupTextureGenerator(textureGenerator);

	// Load GUI textures and test color textures
	{
		const textures = await (await fetch("assets/textures/textures.json")).json();
		const testTexturesLength = 3;
		const buttonWidths = [Button.m, Button.l];

		gui.renderer.createTextureArray(textures.length + buttonWidths.length + testTexturesLength);

		await gui.renderer.loadTextures(textures, instance.texturePath);
		await gui.renderer.loadTestTextures();
		gui.renderer.loadButtonTextures(buttonWidths);
	}

	gui.push(new MainMenuLayer());

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}