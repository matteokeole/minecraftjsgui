## MainMenuLayer

```js
import {Button, Component, Group, Image, ImageButton, Layer, Text} from "src/gui";
import {Vector2} from "src/math";

class MainMenuLayer extends Layer {
	build(router) {
		return [
			new Image({
				alignment: Component.alignCenterTop,
				offset: new Vector2(0, 48),
				size: new Vector2(248, 96),
				texture: "gui/title/minecraft.png",
				uv: new Vector2(0, 0),
			}),
			new Group({
				alignment: Component.alignCenter,
				children: [
					new Button({
						alignment: Component.alignCenterTop,
						offset: new Vector2(0, 0),
						width: 200,
						child: new Text("Singleplayer"),
					}),
					new Button({
						alignment: Component.alignCenterTop,
						offset: new Vector2(0, 24),
						width: 200,
						child: new Text("Multiplayer"),
					}),
					new ImageButton({
						alignment: Component.alignLeftBottom,
						offset: new Vector2(0, 0),
						size: new Vector2(20, 20),
						texture: "gui/widgets.png",
						uv: new Vector2(0, 106),
					}),
					new Button({
						alignment: Component.alignLeftBottom,
						offset: new Vector2(24, 0),
						width: 96,
						child: new Text("Options..."),
						onClick: () => router.push(new OptionsLayer()),
					}),
					new Button({
						alignment: Component.alignRightBottom,
						offset: new Vector2(24, 0),
						width: 96,
						child: new Text("Quit"),
						onClick: () => router.pop(),
					}),
					new ImageButton({
						alignment: Component.alignRightBottom,
						offset: new Vector2(0, 0),
						size: new Vector2(20, 20),
						texture: "gui/widgets.png",
						uv: new Vector2(0, 106),
					}),
				],
			}),
			new Text("Copyright", {
				alignment: Component.alignLeftBottom,
				offset: new Vector2(0, 0),
			}),
		];
	}
}
```