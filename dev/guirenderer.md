## GUI renderer

`WebGLRenderer` sub-class responsible of rendering the contents of the current GUI layer(s).

The GUI renderer should update its canvas texture as little as possible. Here are the few cases where an update is necessary:
- On the first render
- After the recover of a lost WebGL context
- On a window resize event
- A redraw requested by a listener (e.g. click) or an asynchronous method (e.g. API call).

### Techniques

- **Instanced drawing**  
Because visual components are quads, they can be instanced. The renderer makes the following call

	```js
	gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, x);
	```
	where `x` is the number of components to render. While `gl.TRIANGLES` requires 6 vertices, `gl.TRIANGLE_FAN` needs only 4.
- **Upscaling**  
With a GUI scale greater than 1, downscaling the canvas allows a faster render time while keeping the quality of a full-size render. The result is scaled up when rendered by the instance.