import {Font, Instance} from "src";
import {GUIManager, GUIRenderer} from "src/gui";
import {MainMenuLayer} from "./layers/MainMenuLayer.js";

/** @type {Instance} */
let instance = new Instance({
	fontPath: "assets/fonts/",
	shaderPath: "assets/shaders/",
	texturePath: "assets/textures/",
});

/** @type {GUIManager} */
export let guiManager = new GUIManager(new GUIRenderer(), instance);

try {
	instance.build();

	await instance.initialize();
	await instance.setupRenderers([guiManager]);
	await guiManager.setupFonts([
		new Font({
			name: "ascii",
			texturePath: "font/",
			letterHeight: 8,
			letterSpacing: 1,
		}),
	]);

	// Load GUI textures and test color textures
	{
		const textures = await (await fetch("assets/textures/textures.json")).json();
		const renderer = guiManager.getRenderer();

		renderer.createTextureArray(textures.length + 3);
		await renderer.loadTextures(textures, instance.getTexturePath());
		await renderer.loadTestTextures();
	}

	guiManager.push(new MainMenuLayer());

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}