import {Font} from "src";
import {GUIComposite, GUIRenderer} from "src/gui";
import {Texture} from "src/wrappers";
import {Instance} from "./Instance.js";
import {InstanceRenderer} from "./InstanceRenderer.js";
import {MainMenuLayer} from "./layers/MainMenuLayer.js";

const instance = new Instance(new InstanceRenderer());

export const guiComposite = new GUIComposite(new GUIRenderer(), instance);

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
		/** @todo Use the first resize to calculate the initial GUI scale multiplier? */
		// Avoid the first resize
		if (this.getIsFirstResize()) return this.setIsFirstResize(false);

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

	// Load assets
	{
		await guiComposite.setupFonts([
			new Font({
				name: "ascii",
				texturePath: "font/",
				letterHeight: 8,
				letterSpacing: 1,
			}),
		]);

		const textures = await (await fetch("assets/textures/textures.json")).json();
		const renderer = guiComposite.getRenderer();

		renderer.createTextureArray(textures.length + 3);
		await renderer.loadTextures(textures, instance.getParameter("texture_path"));
		await loadTestTextures(renderer);
	}

	document.body.appendChild(instance.getRenderer().getCanvas());

	try {
		instance.getResizeObserver().observe(instance.getRenderer().getCanvas(), {box: "device-pixel-content-box"});
	} catch (error) {
		// If "device-pixel-content-box" isn't defined, try with "content-box"
		instance.getResizeObserver().observe(instance.getRenderer().getCanvas(), {box: "content-box"});
	}

	guiComposite.push(new MainMenuLayer());
	instance.run();
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}

async function loadTestTextures(renderer) {
	const gl = renderer.getContext();
	const textures = renderer.getUserTextures();
	const textureLength = Object.keys(textures).length;
	const dimension = 256;
	const imageReplacement = {
		width: dimension,
		height: dimension,
	};
	const canvas = new OffscreenCanvas(dimension, dimension);
	const ctx = canvas.getContext("2d");
	const colors = {
		darkgrey: "#2b2b2b",
		grey: "#6f6f6f",
		overlay: "#000a",
	};
	const colorKeys = Object.keys(colors);

	for (let i = 0, l = colorKeys.length, color; i < l; i++) {
		color = colors[colorKeys[i]];

		ctx.clearRect(0, 0, dimension, dimension);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, dimension, dimension);

		gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, textureLength + i, dimension, dimension, 1, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

		textures[colorKeys[i]] = new Texture(imageReplacement, textureLength + i);
	}
}