import SceneRenderer from "scene-renderer";
import GUI from "GUI";

SceneRenderer.build();

const layer = new GUI.Layer({
	//
});

const image = new GUI.Component.Image({
	//
});

// SceneRenderer.startLoop();



/* Pipeline example:

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



/* Pipeline example #2:

import GUI from "gui";
import {OptionLayer} from "./OptionLayer.js";

export class RootLayer extends GUI.Layer {
	constructor() {
		super();
	}

	build(context) {
		const text = "Options...";

		return new TextButton({
			align: ["center", "top"],
			margin: [0, 8],
			text,
			onClick: () => context.push(OptionLayer),
		});
	}
}

*/