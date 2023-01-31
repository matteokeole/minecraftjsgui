## Component

> Add documentation for component types

> Throw a fatal error when a component doesn't have a texture at render time (e.g. `NoTextureError`/`TextureNotFoundError`)?  
> Or use an error texture instead and keep the app running?

Object that composes a graphical user interface (GUI).  
Components can be splitted into two families:
- **Visual components:** components that are part of the UI visible to the user.
- **Structural components:** invisible components that help visual components determine their final position in the GUI.

### Properties

These properties or their use may differ depending on the component family.

- `texture: WebGLTexture|null = null`  
The texture used to render this component. **This must be present when rendering the component**, otherwise the renderer will throw an error.  
Some visual components require the texture to be provided on creation (e.g. `Image`, `ImageButton`), while others generate a dynamic texture based on their data, like `Button` (width) and `Text` (text and font used). The original image must be loaded before creating the component.

### Component types

#### Visual components

- `Button`
- `Image`
- `ImageButton`
- `Text`

#### Structural components

- `Group` (equivalent to Flutter's `Stack`)

### Use

To create a component, import and instantiate its class:
```js
import {Button} from "src/components";

const button = new Button(...);
```

### Comparison table

| Component | Texture |
| --- | --- |
| `Button` | Generated from [gui/widgets.png](https://github.com/matteokeole/minecraftjsgui/blob/master/assets/textures/gui/widgets.png) |
| `Image` | Provided on creation |
| `ImageButton` | Provided on creation |
| `Text` | Generated from [font/ascii.png](https://github.com/matteokeole/minecraftjsgui/blob/master/assets/textures/font/ascii.png) |