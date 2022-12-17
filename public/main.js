import {NoWebGL2Error} from "errors";
import GUI from "gui";
import GUIRenderer from "gui-renderer";
import SceneRenderer from "scene-renderer";

try {
	SceneRenderer.build();
	await SceneRenderer.init();

	GUIRenderer.build();
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await GUIRenderer.loadTextures(guiTextures);
	await GUIRenderer.init();

	const image = new GUI.Component.Image({
		position: [0, 0],
		size: [40, 40],
		// image: GUIRenderer.gl.texture[],
	});

	GUIRenderer.add(image);

	GUIRenderer.render();
	SceneRenderer.render();
} catch (error) {
	if (!(error instanceof NoWebGL2Error)) {
		GUIRenderer.dispose();
		SceneRenderer.dispose();
	}

	console.error("An error occurred:", error);
	error.display?.();
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