import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {Image, Text} from "../components/index.js";

export function TestLayer() {
	Layer.call(this);

	/** @override */
	this.build = function(context) {
		return [
			new Text("Test with 'ascii' font", {
				align: Component.alignLeftTop,
				margin: new Vector2(10, 10),
				font: context.getFont("ascii"),
				color: Text.RED,
			}),
			new Image({
				align: Component.alignCenter,
				margin: new Vector2(110, 10),
				size: new Vector2(256, 256),
				image: context.getTexture("gui/widgets.png"),
				uv: new Vector2(0, 0),
			}),
		];
	};
}

extend(TestLayer, Layer);