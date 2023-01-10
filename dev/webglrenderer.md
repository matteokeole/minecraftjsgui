### WebGLRenderer properties:
- Has access to a canvas (`HTMLCanvas` or `OffscreenCanvas`)
- Has access to a WebGL context
- Can load/link a `WebGLProgram`
- Can be disposed:
	1. Delete attributes, buffers, uniforms, VAOs and textures
	2. Delete programs
	3. Trigger context loss
	4. Delete the context & canvas

### Use case

```js
import WebGLRenderer from "src/renderer";

const renderer = new WebGLRenderer({
	offscreen: true, // Determines the type of the canvas
	version: 2, // WebGL version
});

document.body.appendChild(renderer.canvas);

/**
 * This holds references for both the program and the shaders
 * 
 * @type {Program}
 */
const program = renderer.loadProgram(
	"assets/shaders/example.vert",
	"assets/shaders/example.frag",
);

try {
	// `linkProgram` must have access to the individual shaders, in case of a compilation error
	renderer.linkProgram(program);
} catch (error) {
	console.error(error);

	renderer.canvas.remove();
}
```