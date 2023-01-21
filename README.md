### WebGL 2D GUI library with Minecraft-related components.

*This repository and [minecraftjs](https://github.com/matteokeole/minecraftjs), [minecraftgui](https://github.com/matteokeole/minecraftgui), [canvasprinter](https://github.com/matteokeole/canvasprinter) and [mcrenderer](https://github.com/matteokeole/mcrenderer) feature GUI, text printing and 3D landscape rendering demos and are intended to be merged in the future.*

The code is written with vanilla JavaScript. No external dependency is required, but some browser features must be enabled (see below). A web server is necessary to fetch the component textures.

The documentation uses the [JSDoc](https://jsdoc.app) syntax.

### Math API

The project uses an internal [general-purpose math API](https://github.com/matteokeole/minecraftjsgui/tree/master/src/math) which features 2D/3D vector and 3x3/4x4 matrix manipulation along with misc utilities.

### Feature support

Some features used in this project are experimental or lack browser compatibility. Here is a list of these features along with their compatibility tables:

- Import maps: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap#browser_compatibility) - [caniuse](https://caniuse.com/import-maps)
- `OffscreenCanvas`: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas#browser_compatibility) - [caniuse](https://caniuse.com/offscreencanvas)