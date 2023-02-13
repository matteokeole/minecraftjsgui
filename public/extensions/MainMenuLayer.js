import {ImageButton, Layer} from "src/gui";
import {Vector2} from "src/math";
import {gui} from "../main.js";
import OptionsLayer from "./OptionsLayer.js";

export default class MainMenuLayer extends Layer {
	constructor() {
		super();
	}

	/** @override */
	initState() {}

	/** @override */
	build() {
		return [
			new ImageButton({
				align: ["left", "top"],
				margin: new Vector2(0, 0),
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
					 * This action will register the children of the new layer in the render queue,
					 * but NOT the children of the already rendered layers.
					 * 
					 * The new components will be rendered on top of the previous ones.
					 */
					gui.push(new OptionsLayer());
					gui.computeTree();
					gui.render();
				},
			}),
		];
	}
}