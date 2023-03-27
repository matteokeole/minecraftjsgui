import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import Button from "../components/Button.js";

export default class TestLayer extends Layer {
	/** @override */
	build() {
		return [
			new Button({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				width: 120,
				disabled: false,
			}),
		];
	}
}