import {Group, ImageButton, Layer} from "src/gui";
import {Vector2} from "src/math";
import {gui} from "../main.js";
import OptionsLayer from "./OptionsLayer.js";

/**
 * @extends Layer
 */
export default class MainMenuLayer extends Layer {
	/** @override */
	build() {
		return [
			new Group({
				align: ["center", "center"],
				margin: new Vector2(0, 0),
				size: new Vector2(200, 96),
				children: [
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
							return;

							gui.push(new OptionsLayer());
							gui.computeTree();
							gui.render();
						},
					}),
					new ImageButton({
						align: ["right", "top"],
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 186),
					}),
					new ImageButton({
						align: ["left", "bottom"],
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 186),
					}),
					new ImageButton({
						align: ["right", "bottom"],
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 186),
					}),
				],
			}),
		];
	}
}