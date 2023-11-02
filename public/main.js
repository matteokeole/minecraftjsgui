import {WebGLRenderer} from "src";
import {BitmapFont} from "src/fonts";
import {GUIComposite, GUIRenderer} from "src/gui";
import {TextureLoader} from "src/loader";
import {MainInstance} from "./MainInstance.js";
import {MainInstanceRenderer} from "./MainInstanceRenderer.js";
import {MainMenuLayer} from "./layers/index.js";

const instance = new MainInstance(new MainInstanceRenderer());

export const guiComposite = new GUIComposite({
	renderer: new GUIRenderer(),
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
	instance.setParameter("font_path", "assets/fonts/");
	instance.setParameter("shader_path", "assets/shaders/");
	instance.setParameter("texture_path", "assets/textures/");
	instance.setParameter("current_scale", 2);
	instance.setParameter("desired_scale", 2);
	instance.setParameter("max_scale", 2);
	instance.setParameter("default_width", 320);
	instance.setParameter("default_height", 240);
	instance.setParameter("resize_delay", 50);
	instance.setComposites([guiComposite]);
	instance.setResizeObserver(new ResizeObserver(function([entry]) {
		/**
		 * @todo Use the first resize to calculate the initial GUI scale multiplier?
		 */

		// Avoid the first resize
		if (this.isFirstResize()) {
			this.setFirstResize(false);

			return;
		}

		clearTimeout(this.getResizeTimeoutId());
		this.setResizeTimeoutId(setTimeout(() => {
			let width, height, dpr = 1;

			if (entry.devicePixelContentBoxSize) {
				({inlineSize: width, blockSize: height} = entry.devicePixelContentBoxSize[0]);
			} else {
				dpr = devicePixelRatio;

				if (entry.contentBoxSize) {
					entry.contentBoxSize[0] ?
						({inlineSize: width, blockSize: height} = entry.contentBoxSize[0]) :
						({inlineSize: width, blockSize: height} = entry.contentBoxSize);
				} else ({width, height} = entry.contentRect);
			}

			this.resize(width, height, dpr);
		}, this.getParameter("resize_delay")));
	}.bind(instance)));

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

	try {
		instance.getResizeObserver().observe(
			instance.getRenderer().getCanvas(),
			{
				box: "device-pixel-content-box",
			},
		);
	} catch (error) {
		// If "device-pixel-content-box" isn't defined, try with "content-box"
		instance.getResizeObserver().observe(
			instance.getRenderer().getCanvas(),
			{
				box: "content-box",
			},
		);
	}

	guiComposite.push(new MainMenuLayer());
	instance.loop();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) {
		document.body.appendChild(error.node);
	}
}