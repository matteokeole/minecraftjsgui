import {Alignment, Layer} from "src/gui";
import {Vector2} from "src/math";
import {Image, ImageButton} from "../components/index.js";

export class OptionsLayer extends Layer {
	/**
	 * @inheritdoc
	 */
	build(context) {
		/**
		 * @type {Number}
		 */
		let counter = 0;

		console.debug(`Rebuilt OptionsLayer, counter = ${counter}`);

		return [
			new Image({
				alignment: Alignment.alignCenter,
				margin: new Vector2(),
				image: context.getTexture("overlay"),
				size: new Vector2(2000, 2000),
				uv: new Vector2(),
			}),
			new Image({
				alignment: Alignment.alignCenter,
				margin: new Vector2(),
				image: context.getTexture("grey"),
				size: new Vector2(300, 180),
				uv: new Vector2(),
			}),
			new ImageButton({
				alignment: Alignment.alignCenter,
				margin: new Vector2(110, -75),
				size: new Vector2(20, 20),
				image: context.getTexture("gui/widgets.png"),
				uv: new Vector2(0, 106),
				onMouseDown: () => console.debug(`Counter = ${++counter}`),
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
			new ImageButton({
				alignment: Alignment.alignCenter,
				margin: new Vector2(134, -75),
				size: new Vector2(20, 20),
				image: context.getTexture("gui/widgets.png"),
				uv: new Vector2(0, 146),
				onMouseDown: () => context.pop(),
				onMouseEnter: function() {
					const subcomponents = this.getSubcomponents();
					subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 166));

					this.setSubcomponents(subcomponents);

					context.pushToRenderQueue(this).render();
				},
				onMouseLeave: function() {
					const subcomponents = this.getSubcomponents();
					subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 146));

					this.setSubcomponents(subcomponents);

					context.pushToRenderQueue(this).render();
				},
			}),
		];
	}
}