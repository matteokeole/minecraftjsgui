import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {CursText, Image} from "../components/index.js";

export function TestLayer() {
	Layer.call(this);

	/** @override */
	this.build = context => [
		new Image({
			align: Component.alignLeftTop,
			margin: new Vector2(0, 0),
			size: new Vector2(15, 18),
			image: context.getTexture("darkgrey"),
			uv: new Vector2(0, 0),
		}),
		new CursText("5", {
			align: Component.alignLeftTop,
			margin: new Vector2(0, 0),
		}),
	];
}

extend(TestLayer, Layer);