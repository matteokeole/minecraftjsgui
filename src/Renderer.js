import {NoWebGL2Error} from "NoWebGL2Error";

let canvas, gl;

function build() {
	canvas = document.createElement("canvas");
	gl = canvas.getContext("webgl2");

	if (!gl) throw new NoWebGL2Error();

	document.body.appendChild(canvas);
}

export default {build};