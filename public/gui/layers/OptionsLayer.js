import {Component, Image, ImageButton, Layer} from "src/gui";
import inherits from "src/inherits";
import {Vector2} from "src/math";
import {gui} from "../../main.js";

export default function OptionsLayer() {
	/** @override */
	this.build = function() {
		/** @type {Number} */
		let counter = 0;

		console.debug(`Rebuilt OptionsLayer, counter = ${counter}`);

		return [
			new Image({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				image: gui.renderer.textures["overlay"],
				size: new Vector2(2000, 2000),
				uv: new Vector2(0, 0),
			}),
			new Image({
				align: Component.alignCenter,
				margin: new Vector2(0, 0),
				image: gui.renderer.textures["grey"],
				size: new Vector2(300, 180),
				uv: new Vector2(0, 0),
			}),
			new ImageButton({
				align: Component.alignCenter,
				margin: new Vector2(110, -75),
				size: new Vector2(20, 20),
				image: gui.renderer.textures["gui/widgets.png"],
				uv: new Vector2(0, 106),
				onMouseEnter: function() {
					const newUv = this.getUV();
					newUv.y = 126;
					this.setUV(newUv);

					gui.renderQueue.push(this);
					gui.render();
				},
				onMouseLeave: function() {
					const newUv = this.getUV();
					newUv.y = 106;
					this.setUV(newUv);

					gui.renderQueue.push(this);
					gui.render();
				},
				onMouseDown: () => console.debug(`Counter = ${++counter}`),
			}),
			new ImageButton({
				align: Component.alignCenter,
				margin: new Vector2(134, -75),
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
				onMouseDown: () => gui.pop(),
			}),
		];
	};

	/** @override */
	this.dispose = () => {};
}

inherits(OptionsLayer, Layer);