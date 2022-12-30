- Group (Flutter `Stack` equivalent)
- Image?
- ImageButton (dynamic image)
- Text (colored, bold, italic, underlined, strikethrough)
- CheckboxInput
- RangeInput
- TextInput

***

#### `Button`

General-purpose dynamic button.
The component height is 20 (hard-coded constant).
Upon creation, the new instance will create `mouseenter` and `mouseleave` listeners for the UV updates.
The component has three UV sets for `base`, `hovered` and `disabled` states (hard-coded constants).
**Note: Requires the *gui/widgets.png* texture.**

###### Parameters
- `width` - *int*
Capped to 200. No minimum defined.
- `disabled` - *bool*
True if the component is disabled, false otherwise.
- `child` - *Component*
Centered both horizontally and vertically because most `Button`s have a `Text` child. Its class should be `Text` (single line), `Image` or `Group`.

### Main menu tree

This is an example of how the main menu component tree should look like.

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