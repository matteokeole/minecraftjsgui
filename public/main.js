import {NoWebGL2Error} from "errors";
import {Image} from "gui";
import GUIRenderer from "gui-renderer";
import Instance from "instance";
import {Vector2} from "math";
import SceneRenderer from "scene-renderer";

Instance.setShaderPath("assets/shaders/");
Instance.setTexturePath("assets/textures/");

try {
	SceneRenderer.build();
	GUIRenderer.build();

	await SceneRenderer.init();
	await GUIRenderer.init();

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await GUIRenderer.loadTextures(guiTextures);

	const image = new Image({
		position: new Vector2(10, 10),
		size: new Vector2(20, 20),
		image: GUIRenderer.textures["gui/widgets.png"],
		uv: new Vector2(0, 106),
	});

	GUIRenderer.add(image);

	GUIRenderer.render();
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