function Renderer() {
	this.loadTextures = function() {
		console.log(`${this.constructor.name}: Loading textures...`);
	};
}

function SceneRenderer() {
	if (SceneRenderer._instance) return SceneRenderer._instance;

	Renderer.call(this);

	SceneRenderer._instance = this;

	this.updateGUITexture = function() {
		console.log(`${this.constructor.name}: Updating GUI texture...`);
	};
}

SceneRenderer.prototype = Renderer.prototype;
SceneRenderer.prototype.name = "SceneRenderer";



// Tests



const sceneRenderer = new SceneRenderer();
const sceneRenderer2 = new SceneRenderer();

console.log(sceneRenderer.constructor.name)

console.warn("Renderer subclasses:");
console.log(1, sceneRenderer instanceof SceneRenderer);
console.log(2, sceneRenderer2 instanceof SceneRenderer);
console.warn("SceneRenderers subclasses:");
console.log(1, sceneRenderer instanceof Renderer);
console.log(2, sceneRenderer2 instanceof Renderer);