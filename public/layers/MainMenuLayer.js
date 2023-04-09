import {Component, Layer} from "src/gui";
import {Vector2} from "src/math";
import {extend} from "src/utils";
import {OptionsLayer} from "./OptionsLayer.js";
import {Button, Group, ImageButton, Text} from "../components/index.js";

export function MainMenuLayer() {
	Layer.call(this);

	/** @override */
	this.build = context => [
		new Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", {
			align: Component.alignCenterTop,
			margin: new Vector2(0, 10),
			color: Text.YELLOW,
		}),
		new Group({
			align: Component.alignCenter,
			margin: new Vector2(0, 0),
			size: new Vector2(248, 104),
			children: [
				new Button({
					align: Component.alignCenterTop,
					margin: new Vector2(0, 0),
					width: 200,
				}),
				new Button({
					align: Component.alignCenterTop,
					margin: new Vector2(0, 24),
					width: 200,
				}),
				new Button({
					align: Component.alignCenterTop,
					margin: new Vector2(0, 48),
					width: 200,
				}),
				new ImageButton({
					align: Component.alignLeftBottom,
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 106),
					onMouseEnter: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV().x, 126));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
					onMouseLeave: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV().x, 106));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
				}),
				new Button({
					align: Component.alignLeftBottom,
					margin: new Vector2(24, 0),
					width: 98,
					onMouseDown: () => context.push(new OptionsLayer()),
				}),
				new Button({
					align: Component.alignRightBottom,
					margin: new Vector2(24, 0),
					width: 98,
					disabled: true,
				}),
				new ImageButton({
					align: Component.alignRightBottom,
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/accessibility.png"),
					uv: new Vector2(0, 0),
					onMouseEnter: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV().x, 20));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
					onMouseLeave: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV().x, 0));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
				}),
			],
		}),
	];
}

extend(MainMenuLayer, Layer);