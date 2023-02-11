## WebGLRenderer

> How does this class accesses the base paths for textures and shaders?

Class grouping a DOM/offscreen canvas, GLSL shaders and WebGL textures to make general-purpose rendering.

### Properties

- `canvas: HTMLCanvasElement|OffscreenCanvas|null = null`  
Canvas on which the render will occur.
- `gl: WebGLRenderingContext|WebGLRenderingContext|null = null`  
WebGL context obtained from this renderer's canvas.
- `textures: WebGLTexture[]`  
The list of textures loaded with this renderer's context, not shareable with other renderers.

### Dispose

The `dispose` method is the opposite of `build`. It discards the context data, such as attributes, uniforms, buffers, textures and VAOs. The context and its canvas are also removed, with the latter being removed from the DOM (this allows the custom error to show underneath).

The `dispose` method is called:
- when exiting the game
- when a fatal error occurs. The canvases must be removed to show the custom error.

1. Delete attributes, buffers, uniforms, VAOs and textures
2. Delete programs
3. Trigger context loss
4. Clear context and remove canvas DOM node

### Interface

```js
/**
 * @param {Boolean} offscreen Determines the type of the canvas
 * @param {Boolean} generateMipmaps Determines whether `loadTextures` generates mipmaps for each texture
 * @param {Number} version WebGL version
 */
WebGLRenderer({offscreen, generateMipmaps, version}) {
	/**
	 * @public
	 * @type {HTMLCanvasElement|OffscreenCanvas|null}
	 */
	canvas = null;

	/**
	 * @public
	 * @type {WebGLRenderingContext|WebGL2RenderingContext|null}
	 */
	gl = null;

	/**
	 * @public
	 * @type {WebGLTexture[]}
	 */
	textures = [];

	/**
	 * @public
	 */
	build();

	/**
	 * @public
	 * @param {String} vertexPath
	 * @param {String} fragmentPath
	 * @returns {Program}
	 */
	async loadProgram(vertexPath, fragmentPath);

	/**
	 * @public
	 * @param {Program} program
	 * @returns {Boolean}
	 */
	linkProgram(program);

	/**
	 * @public
	 * @param {String[]} sources
	 */
	async loadTextures(sources);

	/**
	 * @public
	 */
	dispose();
}
```

### Example

```js
import WebGLRenderer from "src/renderer";

const interfaceRenderer = new WebGLRenderer({
	offscreen: true,
	generateMipMaps: false,
	version: 2,
});

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