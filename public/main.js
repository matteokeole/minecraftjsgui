import {GUIComposite} from "../src/Composite/index.js";
import {BitmapFont} from "../src/Font/index.js";
import {TextureLoader} from "../src/Loader/index.js";
import {WebGLGUIRenderer, WebGLInstanceRenderer, WebGLRenderer} from "../src/Renderer/WebGL/index.js";
import {Instance} from "./Instance.js";
import {MainMenuLayer} from "./layers/index.js";

const instanceRenderer = new WebGLInstanceRenderer();
const instance = new Instance(instanceRenderer);

const guiRenderer = new WebGLGUIRenderer();
const guiComposite = new GUIComposite({
	renderer: guiRenderer,
	instance,
	fonts: {
		ascii: new BitmapFont({
			glyphMapPath: "ascii.json",
			texturePath: "font/ascii.png",
			tileHeight: 8,
			tileSpacing: 1,
		}),
	},
});

try {
	instance.setFramesPerSecond(30);
	instance.setParameter("root_path", "src/");
	instance.setParameter("font_path", "assets/fonts/");
	instance.setParameter("texture_path", "assets/textures/");
	instance.setParameter("current_scale", 2);
	instance.setParameter("desired_scale", 2);
	instance.setParameter("max_scale", 2);
	instance.setParameter("default_width", 320);
	instance.setParameter("default_height", 240);
	instance.setParameter("resize_delay", 50);
	instance.setComposites([guiComposite]);

	await instance.build();

	const loader = new TextureLoader(instance.getParameter("texture_path"));
	const textures = await loader.load("textures.json");
	const colors = loader.loadColors([
		{
			name: "darkgrey",
			value: Uint8Array.of(43, 43, 43, 255),
		}, {
			name: "grey",
			value: Uint8Array.of(111, 111, 111, 255),
		}, {
			name: "overlay",
			value: Uint8Array.of(0, 0, 0, 170),
		},
	], WebGLRenderer.MAX_TEXTURE_SIZE);

	guiComposite.getRenderer().createTextureArray(textures.concat(colors), false);

	document.body.appendChild(instance.getRenderer().getCanvas());

	instance.loop();

	/**
	 * @todo Make the instance call the composites itself to update their render texture,
	 * and do the render when all textures have been updated
	 * 
	 * This is a dirty hack to make sure the GUI scale is correct on the first frame
	 */
	await new Promise(resolve => setTimeout(resolve, instance.getParameter("resize_delay") + 1));

	guiComposite.push(new MainMenuLayer());
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) {
		document.body.appendChild(error.node);
	}
}