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