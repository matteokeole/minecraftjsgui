```js
[
	new Image({
		alignment: ["center", "top"],
		offset: new Vector2(0, 48),
		size: new Vector2(248, 96),
		texture: "gui/title/minecraft.png",
		uv: new Vector2(0, 0),
	}),
	new Group({
		alignment: ["center", "center"],
		children: [
			new Button({
				alignment: ["center", "top"],
				offset: new Vector2(0, 0),
				width: 200,
				child: new Text("Singleplayer"),
			}),
			new Button({
				alignment: ["center", "top"],
				offset: new Vector2(0, 24),
				width: 200,
				child: new Text("Multiplayer"),
			}),
			new ImageButton({
				alignment: ["left", "bottom"],
				offset: new Vector2(0, 0),
				size: new Vector2(20, 20),
				texture: "gui/widgets.png",
				uv: new Vector2(0, 106),
			}),
			new Button({
				alignment: ["left", "bottom"],
				offset: new Vector2(24, 0),
				width: 96,
				child: new Text("Options..."),
			}),
			new Button({
				alignment: ["right", "bottom"],
				offset: new Vector2(24, 0),
				width: 96,
				child: new Text("Quit"),
			}),
			new ImageButton({
				alignment: ["right", "bottom"],
				offset: new Vector2(0, 0),
				size: new Vector2(20, 20),
				texture: "gui/widgets.png",
				uv: new Vector2(0, 106),
			}),
		],
	}),
	new Text("Copyright", {
		alignment: ["left", "bottom"],
		offset: new Vector2(0, 0),
	}),
]
```