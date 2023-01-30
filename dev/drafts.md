### Renderers

#### Output renderer

The output renderer is the only DOM renderer. It renders the canvas textures of the other renderers.

#### Custom renderers

A custom renderer is an offscreen `Renderer` sub-class which plays a specific role in the rendering pipeline. Some examples:
- The scene renderer renders the game scene.
- The GUI renderer renders the user interface.

Each custom renderer registered by the instance has access to its **canvas texture** (`WebGLTexture`) and can update it when a change must be visible for the user (e.g. a GUI hover effect on a button). The output renderer will use the new canvas texture on the frame following the update.

### Rendering pipeline

On every frame, the output renderer draws the canvas texture of each custom renderer. This result is stretched to fill the entire viewport.

### As few GUI updates as possible

The GUI renderer should update its canvas texture as little as possible. Here are the few cases where an update is necessary:
- On the first render
- After the recover of a lost WebGL context
- On a window resize event
- A redraw requested by a listener (e.g. click) or an asynchronous method (e.g. API call).

***

### Drafts

#### Instanced GUI (done at a certain extent)

The goal is to make a single draw call when rendering one or more GUI components.
The components that needs a redraw are added in a **render queue**, which registers their world and texture matrices into the related buffers.
With that in place, `GUIRenderer.render()` makes a call to
```js
gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, n);
```
where `n` is the number of components in the queue, and then clears the queue.

If a single component needs a redraw (e.g. an hover update), it registers itself in the queue and calls `GUIRenderer.render()`.

###### Constraints

How to render `Button` instances which need 2 draw calls for each side, or `Text` instances which require the text to be pre-generated as a texture? **Texture generators**