import {Component, Layer} from "src/gui";
import {Vector2, Vector3} from "src/math";
import {extend} from "src/utils";
import {OptionsLayer} from "./OptionsLayer.js";
import {ImageButton, Text} from "../components/index.js";

export function MainMenuLayer() {
	Layer.call(this);

	/** @override */
	this.build = context => [
		/* new Group({
			align: Component.alignCenter,
			margin: new Vector2(0, 0),
			size: new Vector2(200, 96),
			children: [
				new ImageButton({
					align: Component.alignLeftTop,
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 146),
					onMouseEnter: function() {
						const newUv = this.getUV();
						newUv.y = 166;
						this.setUV(newUv);

						context.renderQueue.push(this);
						context.render();
					},
					onMouseLeave: function() {
						const newUv = this.getUV();
						newUv.y = 146;
						this.setUV(newUv);

						context.renderQueue.push(this);
						context.render();
					},
					onMouseDown: () => context.push(new OptionsLayer()),
				}),
				new ImageButton({
					align: Component.alignRightTop,
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: Component.alignLeftBottom,
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: Component.alignRightBottom,
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
			],
		}), */
		new ImageButton({
			align: Component.alignLeftTop,
			margin: new Vector2(0, 0),
			size: new Vector2(20, 20),
			image: context.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 146),
			onMouseEnter: function() {
				const subcomponents = this.getSubcomponents();
				subcomponents[0].setUV(new Vector2(subcomponents[0].getUV().x, 166));

				this.setSubcomponents(subcomponents);

				context.renderQueue.push(this);
				context.render();
			},
			onMouseLeave: function() {
				const subcomponents = this.getSubcomponents();
				subcomponents[0].setUV(new Vector2(subcomponents[0].getUV().x, 146));

				this.setSubcomponents(subcomponents);

				context.renderQueue.push(this);
				context.render();
			},
			onMouseDown: () => context.push(new OptionsLayer()),
		}),
		new ImageButton({
			align: Component.alignRightTop,
			margin: new Vector2(0, 0),
			size: new Vector2(20, 20),
			image: context.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 186),
		}),
		new ImageButton({
			align: Component.alignLeftBottom,
			margin: new Vector2(0, 0),
			size: new Vector2(20, 20),
			image: context.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 186),
		}),
		new ImageButton({
			align: Component.alignRightBottom,
			margin: new Vector2(0, 0),
			size: new Vector2(20, 20),
			image: context.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 186),
		}),
		new Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", {
			align: Component.alignCenter,
			margin: new Vector2(0, 0),
			color: Text.YELLOW,
		}),
	];
}

extend(MainMenuLayer, Layer);