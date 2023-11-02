import {Alignment, Layer} from "src/gui";
import {Vector2} from "src/math";
import {OptionsLayer} from "./index.js";
import {Button, Group, ImageButton} from "../components/index.js";

export class MainMenuLayer extends Layer {
	/**
	 * @inheritdoc
	 */
	build(context) {
		return new Group({
			alignment: Alignment.center,
			margin: new Vector2(),
			size: new Vector2(248, 104),
			children: [
				new Button({
					alignment: Alignment.topCenter,
					margin: new Vector2(),
					width: 200,
				}),
				new Button({
					alignment: Alignment.topCenter,
					margin: new Vector2(0, 24),
					width: 200,
				}),
				new Button({
					alignment: Alignment.topCenter,
					margin: new Vector2(0, 48),
					width: 200,
				}),
				new ImageButton({
					alignment: Alignment.bottomLeft,
					margin: new Vector2(),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 106),
					onMouseEnter: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 126));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
					onMouseLeave: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 106));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
				}),
				new Button({
					alignment: Alignment.bottomLeft,
					margin: new Vector2(24, 0),
					width: 98,
					onMouseDown: () => context.push(new OptionsLayer()),
				}),
				new Button({
					alignment: Alignment.bottomRight,
					margin: new Vector2(24, 0),
					width: 98,
					disabled: true,
				}),
				new ImageButton({
					alignment: Alignment.bottomRight,
					margin: new Vector2(),
					size: new Vector2(20, 20),
					image: context.getTexture("gui/accessibility.png"),
					uv: new Vector2(),
					onMouseEnter: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 20));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
					onMouseLeave: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 0));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this).render();
					},
				}),
			],
		});
	}
}