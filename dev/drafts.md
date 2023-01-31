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