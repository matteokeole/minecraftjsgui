import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {Button, Text} from "../components/index.js";

export default class TestLayer extends Layer {
	/** @override */
	build() {
		return [
			new Text({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			}),
		];
	}
}