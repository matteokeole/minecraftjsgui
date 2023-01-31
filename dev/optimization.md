### GUI optimization techniques

- Instanced drawing of component quads
- Dynamic textures (`Button` and `Text`) are cached after generation
- Upscaling in the output renderer (noticeable for complex GUIs with scale > 1)
- Pooling (https://gist.github.com/louisstow/5609992)?
- Updates target only the necessary components (render queue)