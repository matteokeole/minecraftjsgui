## WebGLRenderer

Class grouping a DOM/offscreen canvas, GLSL shaders and WebGL textures to make general-purpose rendering.

### Properties

- `canvas: HTMLCanvasElement|OffscreenCanvas|null = null`  
Canvas on which the render will occur.
- `gl: WebGLRenderingContext|WebGLRenderingContext|null = null`  
WebGL context obtained from this renderer's canvas.
- `textures: WebGLTexture[]`  
The list of textures loaded with this renderer's context, not shareable with other renderers.

### Dispose

The `dispose` method is called:
- when exiting the game
- when a fatal error occurs. The canvases must be removed to show the custom error.

1. Delete attributes, buffers, uniforms, VAOs and textures
2. Delete programs
3. Trigger context loss
4. Clear context and remove canvas DOM node

### Interface

```js
function WebGLRenderer() {
	/**
	 * @public
	 * @type {HTMLCanvasElement|OffscreenCanvas|null}
	 */
	this.canvas = null;

	/**
	 * @public
	 * @type {WebGLRenderingContext|WebGL2RenderingContext|null}
	 */
	this.gl = null;

	/**
	 * @public
	 * @type {WebGLTexture[]}
	 */
	this.textures = [];

	/**
	 * @public
	 */
	this.build = function() {};

	/**
	 * @public
	 * @param {String} vertexPath
	 * @param {String} fragmentPath
	 * @returns {Program}
	 */
	this.loadProgram = function(vertexPath, fragmentPath) {};

	/**
	 * @public
	 * @param {Program} program
	 * @returns {Boolean}
	 */
	this.linkProgram = function(program) {};

	/**
	 * @public
	 */
	this.dispose = function() {};
}
```

### Example

```js
import WebGLRenderer from "src/renderer";

const renderer = new WebGLRenderer({
	/** @type {Boolean} */
	offscreen: false, // Determines the type of the canvas
	/** @type {Number} */
	version: 2, // WebGL version
});

document.body.appendChild(renderer.canvas);

/**
 * This holds references for both the program and the shaders.
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

	renderer.dispose();
}
```