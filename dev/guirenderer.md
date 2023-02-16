## GUI renderer

`WebGLRenderer` sub-class responsible of rendering the contents of the current GUI layer(s).

The GUI renderer should update its canvas texture as little as possible. Here are the few cases where an update is necessary:
- On the first render
- After the recover of a lost WebGL context
- On a window resize event
- A redraw requested by a listener (e.g. click) or an asynchronous method (e.g. API call).

### Techniques

- **Instanced drawing**  
Because visual components are quads, they can be instanced. The renderer makes the following call

	```js
	gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, x);
	```
	where `x` is the number of components to render. While `gl.TRIANGLES` requires 6 vertices, `gl.TRIANGLE_FAN` needs only 4.
- **Upscaling**  
With a GUI scale greater than 1, downscaling the canvas allows a faster render time while keeping the quality of a full-size render. The result is scaled up when rendered by the instance.

### Routing

The view is composed of layers stacked above each other. The current layer is the last entry from the stack.  
All layers are dynamic (rendered each frame), but only the current layer is directly focusable and will react to user events. The GUI renderer uses instanced drawing to render the layer stack:

```js
import {Button} from "src/gui/components";
import Layer from "src/gui/layer";
import {renderer} from "../main.js";

const layer1 = new Layer({
	tree: [
		new Button(...),
	],
});

const layer2 = new Layer({
	tree: [
		new Text(...),
	],
});

const {router} = renderer;

/**
 * `layer2` is now the current layer.
 * 
 * New layer stack: [layer1, layer2]
 */
router.push(layer1, layer2);

/**
 * The renderer gets the components to render,
 * then puts their world matrices into the position buffer,
 * then puts their texture matrices into the texture buffer,
 * then registers all their texture indices in the GUI texture array,
 * then renders the GUI with instanced drawing and gl.TRIANGLES_FAN.
 * 
 * New render queue: [Button, Text]
 * The button is drawn before the text.
 */
renderer.render();

/**
 * `layer1` is now the current (and only) layer.
 * 
 * New layer stack: [layer1]
 */
router.pop();

/**
 * New render queue: [Button]
 * The buffer sizes have changed.
 */
renderer.render();
```

A `Router` can be used to push and pop layers from the stack. Each frame, the GUI renderer draws the layers in order, so when the stack is updated, the visual update will occur the next frame.

Some layers have a dark transparent background behind their components. This seems to be configurable for each layer?