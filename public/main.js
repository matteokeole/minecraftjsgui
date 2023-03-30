import Instance from "src/instance";
import {GUI, GUIRenderer} from "src/gui";
import Layer from "./layers/MainMenuLayer.js";
// import Layer from "./layers/TestLayer.js";

/** @todo Fix undefined instance on throw */

/** @type {?GUI} */
export let gui;

/** @type {?Instance} */
let instance;

try {
	instance = new Instance({
		shaderPath: "assets/shaders/",
		texturePath: "assets/textures/",
	});

	gui = new GUI(instance, new GUIRenderer());

	instance.build();
	await instance.initialize();
	await instance.setupRenderers([gui]);

	// Load GUI textures and test color textures
	const textures = await (await fetch("assets/textures/textures.json")).json();

	gui.renderer.createTextureArray(textures.length + 3);
	await gui.renderer.loadTextures(textures, instance.getTexturePath());
	await gui.renderer.loadTestTextures();
	gui.loadFontSubcomponents(await (await fetch("assets/font/ascii.json")).json());

	gui.push(new Layer());

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}