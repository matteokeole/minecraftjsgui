import {ImageButton, Layer} from "src/gui";
import {Vector2} from "src/math";
import {gui} from "../main.js";

export default class OptionsLayer extends Layer {
	constructor() {
		super();
	}

	/** @override */
	initState() {}

	/** @override */
	build() {
		return [
			new ImageButton({
				align: ["right", "top"],
				margin: new Vector2(20, 0),
				size: new Vector2(20, 20),
				image: gui.renderer.textures["gui/widgets.png"],
				uv: new Vector2(0, 146),
				onMouseEnter: function() {
					const newUv = this.getUV();
					newUv.y = 166;
					this.setUV(newUv);

					gui.renderQueue.push(this);
					gui.render();
				},
				onMouseLeave: function() {
					const newUv = this.getUV();
					newUv.y = 146;
					this.setUV(newUv);

					gui.renderQueue.push(this);
					gui.render();
				},
				onMouseDown: function() {
					/**
					 * This action will register the children from all the stack layers.
					 * All the previous layers will be rendered.
					 */
					gui.pop();
					gui.computeTree();
					gui.render();
				},
			}),
		];
	}
}