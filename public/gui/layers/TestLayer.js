import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import Button from "../components/ButtonSC.js";

export default class TestLayer extends Layer {
	/** @override */
	build() {
		return [
			new Button({
				align: Component.alignLeftTop,
				margin: new Vector2(0, 0),
				uv: new Vector2(0, 0),
				width: 200,
				disabled: false,
			}),
		];
	}
}