import {Component, Image, ImageButton, Layer} from "src/gui";
import {Vector2} from "src/math";
import {gui} from "../../main.js";
import OptionsLayer from "./OptionsLayer.js";

export default class MainMenuLayer extends Layer {
	/** @override */
	build() {
		return [
			/* new Group({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				size: new Vector2(200, 96),
				children: [
					new ImageButton({
						align: Component.alignLeftTop,
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
						align: Component.alignRightTop,
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 186),
					}),
					new ImageButton({
						align: Component.alignLeftBottom,
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 186),
					}),
					new ImageButton({
						align: Component.alignRightBottom,
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 186),
					}),
				],
			}), */
			new ImageButton({
				align: Component.alignLeftTop,
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
					gui.push(new OptionsLayer());
					gui.computeTree();
					gui.render();
				},
			}),
			new ImageButton({
				align: Component.alignRightTop,
				margin: new Vector2(0, 0),
				size: new Vector2(20, 20),
				image: gui.renderer.textures["gui/widgets.png"],
				uv: new Vector2(0, 186),
			}),
			new ImageButton({
				align: Component.alignLeftBottom,
				margin: new Vector2(0, 0),
				size: new Vector2(20, 20),
				image: gui.renderer.textures["gui/widgets.png"],
				uv: new Vector2(0, 186),
			}),
			new ImageButton({
				align: Component.alignRightBottom,
				margin: new Vector2(0, 0),
				size: new Vector2(20, 20),
				image: gui.renderer.textures["gui/widgets.png"],
				uv: new Vector2(0, 186),
			}),
			new Image({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				image: gui.renderer.textures["blue"],
				size: new Vector2(300, 250),
				uv: new Vector2(0, 0),
			}),
		];
	}
}