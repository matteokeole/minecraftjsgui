import {Layer} from "../../src/GUI/index.js";
import * as Alignment from "../../src/GUI/Alignment/index.js";
import {Vector2} from "../../src/math/index.js";
import {Text} from "../components/index.js";

export class TestLayer extends Layer {
	/**
	 * @inheritdoc
	 */
	build(context) {
		return new Text("Test with \"ascii\" font", {
			alignment: Alignment.left | Alignment.top,
			margin: new Vector2(10, 10),
			font: context.getFont("ascii"),
			color: Text.DARK_GRAY,
			context,
		});
	}
}