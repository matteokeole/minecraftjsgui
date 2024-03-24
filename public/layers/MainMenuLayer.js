import {Layer} from "../../src/GUI/index.js";
import * as Alignment from "../../src/GUI/Alignment/index.js";
import {Group} from "../../src/GUI/Component/index.js";
import {MouseDownEvent, MouseMoveEvent} from "../../src/GUI/Event/index.js";
import {Vector2} from "../../src/math/index.js";
import {OptionsLayer} from "./index.js";
import {Button, ImageButton} from "../components/index.js";

export class MainMenuLayer extends Layer {
	/**
	 * @inheritdoc
	 */
	build(context) {
		return new Group({
			alignment: Alignment.middle | Alignment.center,
			margin: new Vector2(),
			size: new Vector2(248, 104),
			children: [
				new Button({
					alignment: Alignment.middle | Alignment.top,
					margin: new Vector2(),
					width: 200,
					context,
				}),
				new Button({
					alignment: Alignment.middle | Alignment.top,
					margin: new Vector2(0, 24),
					width: 200,
					context,
				}),
				new Button({
					alignment: Alignment.middle | Alignment.top,
					margin: new Vector2(0, 48),
					width: 200,
					context,
				}),
				new ImageButton({
					alignment: Alignment.left | Alignment.bottom,
					margin: new Vector2(),
					size: new Vector2(20, 20),
					events: [
						MouseMoveEvent.NAME,
					],
					texture: context.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 106),
					onMouseEnter(context) {
						this.getSubcomponents()[0].getUV()[1] = 126;

						context.pushToRenderQueue(this);
						context.render();
					},
					onMouseLeave(context) {
						this.getSubcomponents()[0].getUV()[1] = 106;

						context.pushToRenderQueue(this);
						context.render();
					},
				}),
				new Button({
					alignment: Alignment.left | Alignment.bottom,
					margin: new Vector2(24, 0),
					width: 98,
					events: [
						MouseDownEvent.NAME,
					],
					onMouseDown(context) {
						context.push(new OptionsLayer());
					},
					context,
				}),
				new Button({
					alignment: Alignment.right | Alignment.bottom,
					margin: new Vector2(24, 0),
					width: 98,
					disabled: true,
					context,
				}),
				new ImageButton({
					alignment: Alignment.right | Alignment.bottom,
					margin: new Vector2(),
					size: new Vector2(20, 20),
					events: [
						MouseMoveEvent.NAME,
					],
					texture: context.getTexture("gui/accessibility.png"),
					uv: new Vector2(),
					onMouseEnter(context) {
						this.getSubcomponents()[0].getUV()[1] = 20;

						context.pushToRenderQueue(this);
						context.render();
					},
					onMouseLeave(context) {
						this.getSubcomponents()[0].getUV()[1] = 0;

						context.pushToRenderQueue(this);
						context.render();
					},
				}),
			],
		});
	}
}