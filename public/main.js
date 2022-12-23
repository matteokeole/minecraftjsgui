import {NoWebGL2Error} from "errors";
import {Image} from "gui";
import {Vector2} from "math";
import Instance from "instance";
import GUIRenderer from "./renderers/GUIRenderer.js";
import SceneRenderer from "./renderers/SceneRenderer.js";

export const instance = new Instance();

try {
	instance.build();

	SceneRenderer.build();
	GUIRenderer.build();

	await SceneRenderer.init();
	await GUIRenderer.init();

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await GUIRenderer.loadTextures(guiTextures);

	const image = new Image({
		align: ["center", "center"],
		margin: new Vector2(0, 0),
		size: new Vector2(20, 20),
		image: GUIRenderer.textures["gui/widgets.png"],
		uv: new Vector2(0, 146),
	});

	GUIRenderer.add(image);

	GUIRenderer.render();

	/** @todo Loop-related methods must be in the instance */
	SceneRenderer.startLoop();
} catch (error) {
	// Make sure the renderers have been built before dispose
	if (!(error instanceof NoWebGL2Error)) {
		GUIRenderer.dispose();
		SceneRenderer.dispose();
	}

	error.display?.();

	console.error("An error occurred:", error);
}



/* Pipeline example

import {Layer, TextButton} from "gui";

// Each layer has an onEscape listener that decrements the current layer priority and displays the correct one.
// The only exception is the root layer, which has a priority of 0 and can't be escaped.
const rootLayer = new Layer({
	priority: 0,
});
const optionLayer = new Layer({
	priority: 1,
	background: TEXTURES["gui/option_background.png"],
});

const optionButton = new TextButton({
	align: ["center", "center"],
	margin: [0, 0],
	text: "Options...",
	disabled: false,
	onClick: () => GUIRenderer.push(optionLayer),
});

rootLayer.add(optionButton);

GUIRenderer.setLayers([rootLayer, optionLayer]);
GUIRenderer.render();

*/