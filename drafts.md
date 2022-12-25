### Renderers

#### Output renderer

The output renderer is the only one that is non-offscreen. Its canvas must be an `HTMLCanvasElement`.
The job of the output renderer is to draw in the game loop the content textures of the other renderers.

#### Custom renderers

A custom renderer is a renderer that extends the `Renderer` towards a specific role in the rendering pipeline. Some examples:
- The scene renderer uses 3D-related content to render the game scene.
- The GUI renderer uses an architecture made of components.

All custom renderers must be offscreen.
Each custom renderer registered by the instance has access to its **content texture** (a `WebGLTexture` with the contents of its canvas) and can update it when a change must be visible for the user, for example a GUI hover effect on a button. The main renderer will use the new content texture on the frame following the update.

### Pipeline

On every frame, the running instance draws the content texture of each renderer.

### GUI notes

The GUI renderer should update its content texture as little as possible.
Here are some cases where a content texture update is needed:
- On a resize render, when all components have been rendered
- On a component render, for example a hover effect update

The `Component.render()` should make a single draw call.

***

#### Instanced GUI

The idea is to make a single draw call when rendering one or more GUI components.
The components that needs a redraw are added in a **stack**, which registers their world/texture matrices into the related buffers.
With that in place, `GUIRenderer.render()` makes a call to `gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, n)` where `n` is the number of registered components, and then clears the stack.

If a single component needs a redraw (e.g. a hover update), it registers itself in the stack and calls `GUIRenderer.render()`.

###### Constraints

How to render TextButtons, which need at least 2 draw calls (left & right sides), without taking the text into account?