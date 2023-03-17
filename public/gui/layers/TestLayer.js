import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import Button from "../components/Button.js";
import Group from "../components/Group.js";
import Image from "../components/Image.js";
import ImageButton from "../components/ImageButton.js";
import {gui} from "../../main.js";

export default class TestLayer extends Layer {
	/** @override */
	build() {
		return [
			new Group({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				size: new Vector2(248, 104),
				children: [
					new Button({
						align: Component.alignCenterTop,
						margin: new Vector2(0, 0),
						width: Button.l,
						disabled: false,
					}),
					new Button({
						align: Component.alignCenterTop,
						margin: new Vector2(0, 24),
						width: Button.l,
						disabled: false,
					}),
					new Button({
						align: Component.alignCenterTop,
						margin: new Vector2(0, 48),
						width: Button.l,
						disabled: false,
					}),
					new ImageButton({
						align: Component.alignLeftBottom,
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/widgets.png"],
						uv: new Vector2(0, 106),
						onMouseEnter: function() {
							this.setUV(new Vector2(this.getUV().x, 126));

							gui.renderQueue.push(this);
							gui.render();
						},
						onMouseLeave: function() {
							this.setUV(new Vector2(this.getUV().x, 106));

							gui.renderQueue.push(this);
							gui.render();
						},
					}),
					new Button({
						align: Component.alignLeftBottom,
						margin: new Vector2(24, 0),
						width: Button.m,
						disabled: false,
					}),
					new Button({
						align: Component.alignRightBottom,
						margin: new Vector2(24, 0),
						width: Button.m,
						disabled: true,
					}),
					new ImageButton({
						align: Component.alignRightBottom,
						margin: new Vector2(0, 0),
						size: new Vector2(20, 20),
						image: gui.renderer.textures["gui/accessibility.png"],
						uv: new Vector2(0, 0),
						onMouseEnter: function() {
							this.setUV(new Vector2(this.getUV().x, 20));

							gui.renderQueue.push(this);
							gui.render();
						},
						onMouseLeave: function() {
							this.setUV(new Vector2(this.getUV().x, 0));

							gui.renderQueue.push(this);
							gui.render();
						},
					}),
				],
			}),
		];
	}
}