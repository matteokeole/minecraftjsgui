### Renderers

#### Output renderer

The output renderer is the only DOM renderer. It renders the canvas textures of the other renderers.

#### Custom renderers

A custom renderer is an offscreen `Renderer` sub-class which plays a specific role in the rendering pipeline. Some examples:
- The scene renderer renders the game scene.
- The GUI renderer renders the user interface.

Each custom renderer registered by the instance has access to its **canvas texture** (`WebGLTexture`) and can update it when a change must be visible for the user (e.g. a GUI hover effect on a button). The output renderer will use the new canvas texture on the frame following the update.

### Pipeline

On every frame, the output renderer draws the canvas texture of each custom renderer. This result is stretched to fill the entire viewport.

### GUI notes

The GUI renderer should update its content texture as little as possible.
Here are some cases where a content texture update is needed:
- After the first render
- On a resize event, after the render
- When an event listener bound to a component requests a redraw of it (e.g. an hover effect updates the component UV, but to see the result a redraw must be requested)

Some components need a certain texture to be present in the `textures` folder:
- `Button` instances rely on `widgets.png`
- `Text` instances rely on `font.ascii` (at least)
- `Image`/`ImageButton` instances rely on the texture provided when creating them.

**Solution:** add an error texture used when a texture isn't available. This prevents the demo from crashing when it fails fetching a texture. But does this bring shader errors if the size of the error texture doesn't match that of the wanted texture, and thus invalidates the UV?

***

### Drafts

#### Instanced GUI (done at a certain extent)

The idea is to make a single draw call when rendering one or more GUI components.
The components that needs a redraw are added in a **stack**, which registers their world/texture matrices into the related buffers.
With that in place, `GUIRenderer.render()` makes a call to `gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, n)` where `n` is the number of registered components, and then clears the stack.

If a single component needs a redraw (e.g. an hover update), it registers itself in the stack and calls `GUIRenderer.render()`.

###### Constraints

How to render `Button` instances which need 2 draw calls for each side, or `Text` instances which require the text to be pre-generated as a texture?

#### GUI containers

Containers are components which contain slots.
When creating a container, a slot builder function is passed in the `slotBuilder` property. This function defines the position of the slot at a specific index.
Each slot can have a stack of objects on [0, 64].