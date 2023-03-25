// renderQueue = []

const foo = new Text("foo");
const foobar = new Text("foobar");
const jazz = new Text("jazz");

gui.renderQueue.push(foo, foobar, jazz);

// renderQueue = [Text, Text, Text]

// Registers the world/texture matrices of the subcomponents of the render queue items.
// The shader can only access the subcomponents.
// There isn't a fixed number of subcomponents by component (e.g. Button = 2, Text = at least 1 by char, Title = 2 or 3),
// so attribute divisors can't be used.
// Before rendering, computePosition must be called for each component of the render queue.
gui.render();

function render(scene, camera) {
	const worldMatrices = new Float32Array(scene.length * 9); // 3 * 3, since it's a Matrix3
	const textureMatrices = new Float32Array(scene.length * 9); // 3 * 3, since it's a Matrix3
	const textureIndices = new Uint8Array(); // One indice per subcomponent

	for (let i in renderQueue) {
		const component = renderQueue[i];
		const position = component.getPosition();
		const subcomponents = component.getSubcomponents();
		const textureIndex = component.getTexture().getIndex();

		for (let j in subcomponents) {
			const subcomponent = subcomponents[j];

			textureIndices[j] = textureIndex;
		}
	}

	// bufferdata texture indices

	// draw
}

// Data passed to shader:
// ['f', 'o', 'o', 'f', 'o', 'o', 'b', 'a', 'z', 'j', 'a', 'z', 'z']

// Texture array: [font/ascii.png]