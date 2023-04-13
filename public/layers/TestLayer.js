import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {Text} from "../components/index.js";

/** @extends Layer */
export function TestLayer() {
	Layer.call(this);

	/** @override */
	this.build = context => [
		new Text("Test with 'ascii' font", {
			align: Component.alignLeftTop,
			margin: new Vector2(10, 10),
			font: context.getFont("ascii"),
			color: Text.RED,
		}),
	];
}

extend(TestLayer, Layer);