import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {gui} from "../main.js";
import OptionsLayer from "./OptionsLayer.js";
import Image from "../components/Image.js";
import ImageButton from "../components/ImageButton.js";

export default function MainMenuLayer() {
	/** @override */
	this.build = () => [
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
					onMouseDown: () => gui.push(new OptionsLayer()),
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
			onMouseDown: () => gui.push(new OptionsLayer()),
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
			image: gui.renderer.textures["darkgrey"],
			size: new Vector2(400, 320),
			uv: new Vector2(0, 0),
		}),
	];
}

extend(MainMenuLayer, Layer);