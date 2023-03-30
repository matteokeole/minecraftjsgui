import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {Text} from "../components/index.js";

export default function TestLayer() {
	Layer.call(this);

	/** @override */
	this.build = () => [
		new Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", {
			align: Component.alignCenter,
			margin: new Vector2(0, 0),
		}),
	];
}

extend(TestLayer, Layer);