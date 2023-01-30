#### `Button`

General-purpose dynamic button.  
The button height is 20 (hard-coded constant).
Upon creation, the new instance will create `mouseenter` and `mouseleave` listeners for the UV updates.
The component has three UV sets for `base`, `hovered` and `disabled` states (hard-coded constants).
**Note: Requires the *gui/widgets.png* texture.**

###### Parameters
- `width: int`  
The button width, in pixels and relative to the GUI size. Capped to 200.
- `disabled: Boolean`  
If `true`, the button will get the disabled texture and won't respond to interactions.
- `child: Component`  
Child component of the button, centered both horizontally and vertically because it is usually a `Text` child. Valid children are `Text` (single line), `Image` or `Group`.