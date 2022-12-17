import {NoWebGL2Error} from "errors";
import Component from "gui";
import GUIRenderer from "gui-renderer";
import {Vector2} from "math";
import SceneRenderer from "scene-renderer";

try {
	SceneRenderer.build();
	await SceneRenderer.init();

	GUIRenderer.build();
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await GUIRenderer.loadTextures(guiTextures);
	await GUIRenderer.init();

	/* const image = new Component.Image({
		position: new Vector2(20, 20),
		size: new Vector2(20, 20),
	});

	GUIRenderer.add(image); */

	GUIRenderer.render();
	SceneRenderer.render();
} catch (error) {
	// Make sure the renderers have been build before disposing them
	if (!(error instanceof NoWebGL2Error)) {
		GUIRenderer.dispose();
		SceneRenderer.dispose();
	}

	error.display?.();

	console.error("An error occurred:", error);
}



/* Pipeline example

import GUI from "gui";

// Each layer has an onEscape listener that decrements the current layer priority and displays the correct one.
// The only exception is the root layer, which has a priority of 0.
const rootLayer = new GUI.Layer({
	priority: 0,
});
const optionLayer = new GUI.Layer({
	priority: 1,
	background: TEXTURES["gui/option_background.png"],
});

const optionButton = new GUI.TextButton({
	align: ["center", "center"],
	margin: [0, 0],
	text: "Options...",
	disabled: false,
	onClick: () => GUI.push(optionLayer),
});

rootLayer.add(optionButton);

GUI.setLayers([rootLayer, optionLayer]);
GUI.render();

*/