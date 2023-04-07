import {Font, Instance} from "src";
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
		fontPath: "assets/fonts/",
		shaderPath: "assets/shaders/",
		texturePath: "assets/textures/",
	});
	gui = new GUI(new GUIRenderer(), instance);

	instance.build();
	await instance.initialize();
	await instance.setupRenderers([gui]);
	await gui.setupFonts([
		new Font({
			name: "ascii",
			texturePath: "font/",
			letterHeight: 8,
			letterSpacing: 1,
		}),
		new Font({
			name: "curs",
			texturePath: "font/",
			letterHeight: 18,
			letterSpacing: 3,
		}),
	]);

	// Load GUI textures and test color textures
	const textures = await (await fetch("assets/textures/textures.json")).json();
	const renderer = gui.getRenderer();

	renderer.createTextureArray(textures.length + 3);
	await renderer.loadTextures(textures, instance.getTexturePath());
	await renderer.loadTestTextures();

	gui.push(new Layer());

	instance.startLoop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}