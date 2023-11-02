import {Alignment, Layer} from "src/gui";
import {Vector2} from "src/math";
import {Text} from "../components/index.js";

export class TestLayer extends Layer {
	/**
	 * @inheritdoc
	 */
	build(context) {
		return new Text("Test with \"ascii\" font", {
			alignment: Alignment.topLeft,
			margin: new Vector2(10, 10),
			font: context.getFont("ascii"),
			color: Text.DARK_GRAY,
		});
	}
}