## GUIRenderer

`WebGLRenderer` sub-class responsible of rendering the contents of the current GUI layer(s).

### Rendering

`render()` draws a frame onto the renderer canvas and updates the instance output texture for this renderer. **It should update the output texture as little as possible.**  
The result will be visible when the instance render loop is on.

| Case | What to render |
| --- | --- |
| Component request | User decision: N components from the current layer |
| Layer push | Components of the new layer |
| Layer pop | All excluding the popped layer |
| Window resize event | All |
| Context loss (not implemented) | All |

### Techniques

- **Instanced drawing**  
Because visual components are quads, they can be instanced with

	```js
	gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, x);
	```
	where `x` is the number of components to render. While `gl.TRIANGLES` requires 6 vertices, `gl.TRIANGLE_FAN` only needs 4.
- **Upscaling**  
With a GUI scale greater than 1, downscaling the canvas allows a faster render time while keeping the quality of a full-size render. The result is scaled up when rendered by the instance.

### Routing

The view is composed of layers stacked above each other. The interactive layer is the last entry from the stack.  
All layers are dynamic (rendered each frame), but only the current layer is directly focusable and will react to user events. The GUI renderer uses instanced drawing to render the layer stack:

```js
import {Button, Image, Text} from "src/gui/components";
import {gui} from "./main.js";

class MainMenuLayer extends Layer {
	/** @override */
	build() {
		return [
			new Button(...),
		];
	}
}

class OptionsLayer extends Layer {
	/** @override */
	build() {
		return [
			new Image(...),
			new Text(...),
		];
	}
}

/**
 * The current layer is now an instance of MainMenuLayer.
 * 
 * Current layer stack: [MainMenuLayer]
 * Current render queue: [Button]
 * Current textures used: [gui/widgets.png]
 * A frame has been rendered
 */
gui.push(new MainMenuLayer());



// ...



/**
 * The current layer is now an instance of OptionsLayer.
 * 
 * Current layer stack: [MainMenuLayer, OptionsLayer]
 * Current render queue: [Image, Text]
 * Current textures used: [font/ascii.png, image.png]
 * A frame has been rendered
 */
gui.push(new OptionsLayer());



// ...



/**
 * The current layer is now an instance of MainMenuLayer.
 * 
 * Current layer stack: [MainMenuLayer]
 * Current render queue: [Button]
 * Current textures used: [gui/widgets.png]
 * A frame has been rendered
 */
gui.pop();
```

> Some layers have a dark transparent background behind their components.