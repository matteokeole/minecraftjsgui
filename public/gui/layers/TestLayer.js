import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {gui} from "../../main.js";
import Button from "../components/Button.js";

export default class TestLayer extends Layer {
	/** @override */
	build() {
		return [
			new Button({
				align: Component.alignCenterTop,
				margin: new Vector2(0, 0),
				width: 200,
				image: gui.renderer.textures["grey"],
			}),
		];
	}
}