import {Font} from "src";
import {GUIComposite, GUIRenderer} from "src/gui";
import {MainMenuLayer} from "./layers/MainMenuLayer.js";
import {Instance as TestInstance} from "./Instance.js";
import {InstanceRenderer as TestInstanceRenderer} from "./InstanceRenderer.js";

const instance = new TestInstance(new TestInstanceRenderer());

export const guiComposite = new GUIComposite(new GUIRenderer(), instance);

try {
	instance.setParameter("font_path", "assets/fonts/");
	instance.setParameter("shader_path", "assets/shaders/");
	instance.setParameter("texture_path", "assets/textures/");
	instance.setParameter("current_scale", 2);

	instance.setComposites([guiComposite]);

	await instance.build();

	/** @todo Load assets */
	await guiComposite.setupFonts([
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
		const renderer = guiComposite.getRenderer();

		renderer.createTextureArray(textures.length + 3);
		await renderer.loadTextures(textures, instance.getParameter("texture_path"));
		await renderer.loadTestTextures();
	}

	document.body.appendChild(instance.getRenderer().getCanvas());

	guiComposite.push(new MainMenuLayer());

	instance.run();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}

// /** @type {Instance} */
// let instance = new Instance({
// 	fontPath: "assets/fonts/",
// 	shaderPath: "assets/shaders/",
// 	texturePath: "assets/textures/",
// });

// /** @type {GUIComposite} */
// export let guiComposite = new GUIComposite(new GUIRenderer(), instance);

// try {
// 	instance.build();

// 	await instance.initialize();
// 	await instance.setupRenderers([guiComposite]);
// 	await guiComposite.setupFonts([
// 		new Font({
// 			name: "ascii",
// 			texturePath: "font/",
// 			letterHeight: 8,
// 			letterSpacing: 1,
// 		}),
// 	]);

// 	// Load GUI textures and test color textures
// 	{
// 		const textures = await (await fetch("assets/textures/textures.json")).json();
// 		const renderer = guiComposite.getRenderer();

// 		renderer.createTextureArray(textures.length + 3);
// 		await renderer.loadTextures(textures, instance.getTexturePath());
// 		await renderer.loadTestTextures();
// 	}

// 	guiComposite.push(new MainMenuLayer());

// 	instance.startLoop();
// } catch (error) {
// 	console.error(error);

// 	instance.dispose();

// 	if ("node" in error) document.body.appendChild(error.node);
// }