import {Instance} from "src/instance";
import {GUI, GUIRenderer} from "src/gui";
// import {MainMenuLayer as Layer} from "./layers/MainMenuLayer.js";
import {TestLayer as Layer} from "./layers/TestLayer.js";

/**
 * @todo Fix undefined instance on throw
 * 
 * @type {?Instance}
 */
let instance;

/** @type {?GUI} */
export let gui;

try {
	instance = new Instance({
		shaderPath: "assets/shaders/",
		texturePath: "assets/textures/",
	});
	gui = new GUI(new GUIRenderer(), instance);

	instance.build();
	await instance.initialize();
	await instance.setupRenderers([gui]);

	// Load GUI textures and test color textures
	const textures = await (await fetch("assets/textures/textures.json")).json();
	const renderer = gui.getRenderer();

	renderer.createTextureArray(textures.length + 3);
	await renderer.loadTextures(textures, instance.getTexturePath());
	await renderer.loadTestTextures();
	gui.loadFontSubcomponents(await (await fetch("assets/font/curs.json")).json());

	gui.push(new Layer());

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}