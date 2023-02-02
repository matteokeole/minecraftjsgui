import {Button, Group, Image, ImageButton} from "src/gui";
import Instance from "src/instance";
import {Vector2} from "src/math";
import {default as GUIRenderer, _GUIRenderer} from "./extensions/GUIRenderer.js";

export const instance = new Instance();
export let guiRenderer;

try {
	const renderer = new _GUIRenderer({
		offscreen: false,
		version: 2,
	});

	// console.log(renderer);

	renderer.build();

	/** @type {Program} */
	const program = await renderer.loadProgram(
		"assets/shaders/component.vert",
		"assets/shaders/component.frag",
	);
	renderer.linkProgram(program);

	// console.log(renderer);

	document.body.appendChild(renderer.canvas);

	// const program = await renderer.loadProgram("assets/shaders/main.vert", "assets/shaders/main.frag");
	// renderer.linkProgram(program);

	// instance.build();
	// await instance.initialize();

	/* await instance.setupRenderers([
		guiRenderer = new GUIRenderer(instance),
	]);

	// Load GUI textures
	const guiTextures = await (await fetch("assets/textures/textures.json")).json();
	await guiRenderer.loadTextures(...guiTextures);

	let counter = 0;

	const tree = [
		new Group({
			align: ["center", "center"],
			margin: new Vector2(0, 0),
			size: new Vector2(200, 96),
			children: [
				new ImageButton({
					align: ["left", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 146),
					onMouseEnter: function() {
						const newUv = this.getUV();
						newUv.y = 166;
						this.setUV(newUv);

						guiRenderer.renderQueue.push(this);
						guiRenderer.render();
					},
					onMouseLeave: function() {
						const newUv = this.getUV();
						newUv.y = 146;
						this.setUV(newUv);

						guiRenderer.renderQueue.push(this);
						guiRenderer.render();
					},
					onMouseDown: function() {
						counter++;
						console.log(counter);
					},
				}),
				// new Button({
				// 	align: ["right", "top"],
				// 	margin: new Vector2(0, 0),
				// 	size: new Vector2(200, 20),
				// }),
				new ImageButton({
					align: ["right", "top"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["left", "bottom"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
				new ImageButton({
					align: ["right", "bottom"],
					margin: new Vector2(0, 0),
					size: new Vector2(20, 20),
					image: guiRenderer.getTexture("gui/widgets.png"),
					uv: new Vector2(0, 186),
				}),
			],
		}),
		new Image({
			align: ["right", "bottom"],
			margin: new Vector2(10, 10),
			size: new Vector2(20, 20),
			image: guiRenderer.getTexture("gui/widgets.png"),
			uv: new Vector2(0, 106),
		}),
	];

	guiRenderer.setComponentTree(tree);
	guiRenderer.computeTree();
	guiRenderer.render();

	instance.startLoop(); */
} catch (error) {
	console.error(error);

	instance.dispose();

	if ("node" in error) document.body.appendChild(error.node);
}