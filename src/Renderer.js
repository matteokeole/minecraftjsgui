import {NoWebGL2Error} from "NoWebGL2Error";

const interval = 1000 / 60;
let canvas,
	gl,
	request,
	diff,
	now,
	then;

function build() {
	canvas = document.createElement("canvas");
	gl = canvas.getContext("webgl2");

	if (!gl) throw new NoWebGL2Error();

	document.body.appendChild(canvas);

	init();
}

function init() {
	//
}

function startLoop() {
	then = performance.now();

	loop();
}

const stopLoop = () => cancelAnimationFrame(request);

function loop() {
	request = requestAnimationFrame(loop);

	diff = (now = performance.now()) - then;

	if (diff > interval) {
		then = now - diff % interval;

		render();
	}
}

function render() {}

export default {build, startLoop, stopLoop, render};