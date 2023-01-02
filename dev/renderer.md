### Renderer capatibilities:
- Has access to a canvas (HTMLCanvas of OffscreenCanvas)
- Has access to a WebGLRenderingContext or WebGL2RenderingContext
- Can load a WebGLProgram by specifying its vertex and fragment sources
- Can link a WebGLProgram and throw an exception if the context is not found
- Can be disposed:
	1. Delete attributes, buffers, uniforms, VAOs and textures
	2. Delete programs
	3. Trigger context loss
	4. Delete the context/canvas

### Use case

```js
import Renderer from "src/renderer";

const renderer = new Renderer({
	offscreen: true,
	webglVersion: 2,
});

// This holds references for both the program and the shaders
const programWrapper = renderer.loadProgram("assets/shaders/example.vert", "assets/shaders/example.frag");

try {
	// linkProgram() needs to access the individual shaders, in case of a compilation error
	renderer.linkProgram(programWrapper);
}
```