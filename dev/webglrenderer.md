### WebGLRenderer properties:
- (public) canvas (`HTMLCanvasElement` or `OffscreenCanvas`)
- (public) WebGL context
- (public) loadProgram()/linkProgram()
- (public) dispose():
	1. Delete attributes, buffers, uniforms, VAOs and textures
	2. Delete programs
	3. Trigger context loss
	4. Clear context and remove canvas DOM node

```ts
interface WebGLRenderer {
	public canvas?: HTMLCanvasElement|OffscreenCanvas;
	public gl?: WebGLRenderingContext|WebGL2RenderingContext;
	public build(): void;
	public loadProgram([string: vertexPath, string: fragmentPath]): Program;
	public linkProgram(Program: program): boolean;
	public dispose(): void;
}
```

```js
import WebGLRenderer from "src/renderer";

const renderer = new WebGLRenderer({
	offscreen: false, // Determines the type of the canvas
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
	renderer.linkProgram(program);
} catch (error) {
	console.error("Failed linking the program to the renderer", error);

	renderer.dispose(); // This also removes the canvas from the DOM
}
```