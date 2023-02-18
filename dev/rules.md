## Project rules

- **The `develop` branch is the one used for adding features.** The `master` branch must be presentable as it is the GitHub Pages demo. Optimizations of the existing code are made on the `opt` branch. Merges/rebases are done with PRs.
- **No external library.**
- **Document the code** with the [JSDoc](https://jsdoc.app) syntax.
- **No lost util in the project, except for mathematical functions in the math API.** Each method has at least one logic relation with a class and should be added to it instead of wandering inside an `utils` folder. *Example: `loadProgram` and `linkProgram` are from `WebGLRenderer` because they rely on its WebGL context.*
- **In a class, if a private method B is used by a public method A (and only by this method) once each call, it should be moved into this method A.** This makes B take space only when A is called, and this additional space is freed once A has finished. *Example: `createShader` is only used by `loadProgram`, so it has been moved inside.*