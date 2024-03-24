import {Layer} from "../../src/GUI/index.js";
import * as Alignment from "../../src/GUI/Alignment/index.js";
import {Group} from "../../src/GUI/Component/index.js";
import {Vector2} from "../../src/math/index.js";
import {Image, ImageButton} from "../components/index.js";
import {MouseDownEvent, MouseMoveEvent} from "../../src/GUI/Event/index.js";

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

		return new Group({
			alignment: Alignment.middle | Alignment.center,
			/**
			 * @todo Find a way to position the root element
			 */
			size: new Vector2(innerWidth * .5, innerHeight * .5),
			children: [
				new Image({
					alignment: Alignment.middle | Alignment.center,
					margin: new Vector2(),
					image: context.getTexture("overlay"),
					size: new Vector2(2000, 2000),
					uv: new Vector2(),
				}),
				new Image({
					alignment: Alignment.middle | Alignment.center,
					margin: new Vector2(),
					image: context.getTexture("grey"),
					size: new Vector2(300, 180),
					uv: new Vector2(),
				}),
				new ImageButton({
					alignment: Alignment.middle | Alignment.center,
					margin: new Vector2(110, -75),
					size: new Vector2(20, 20),
					events: [
						MouseDownEvent.NAME,
						MouseMoveEvent.NAME,
					],
					texture: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 106),
					onMouseDown: () => console.debug(`Counter = ${++counter}`),
					onMouseEnter: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 126));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this);
						context.render();
					},
					onMouseLeave: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 106));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this);
						context.render();
					},
				}),
				new ImageButton({
					alignment: Alignment.middle | Alignment.center,
					margin: new Vector2(134, -75),
					size: new Vector2(20, 20),
					events: [
						MouseDownEvent.NAME,
						MouseMoveEvent.NAME,
					],
					texture: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 146),
					onMouseDown: () => context.pop(),
					onMouseEnter: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 166));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this);
						context.render();
					},
					onMouseLeave: function() {
						const subcomponents = this.getSubcomponents();
						subcomponents[0].setUV(new Vector2(subcomponents[0].getUV()[0], 146));

						this.setSubcomponents(subcomponents);

						context.pushToRenderQueue(this);
						context.render();
					},
				}),
			],
		});
	}
}