#### WebGL2 2D GUI library with Minecraft-related base components.

This repository and [*minecraftjs*](https://github.com/matteokeole/minecraftjs), [*minecraftgui*](https://github.com/matteokeole/minecraftgui), [*canvasprinter*](https://github.com/matteokeole/canvasprinter) and [*mcrenderer*](https://github.com/matteokeole/mcrenderer) feature Minecraft GUI, text printing and 3D rendering demos and may be merged in the future.

The code is written with vanilla JavaScript. No external dependency is required, but some browser features may be enabled (see below).

The documentation uses the [JSDoc](https://jsdoc.app) syntax.

## Testing

There is a [test](https://github.com/matteokeole/minecraftjsgui/tree/test) branch for speed and performance benchmarks.

## Math API

The project uses an internal [general-purpose math API](https://github.com/matteokeole/minecraftjsgui/tree/master/src/math) which features 2D/3D vector manipulation, 3x3/4x4 matrix manipulation and some utilities for clamping and intersection checking.

## Feature support

Some features used in this project are experimental or lack browser compatibility. Here is a list of these features along with their compatibility tables:

- Import maps: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap#browser_compatibility) - [caniuse](https://caniuse.com/import-maps)
- `OffscreenCanvas`: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas#browser_compatibility) - [caniuse](https://caniuse.com/offscreencanvas)