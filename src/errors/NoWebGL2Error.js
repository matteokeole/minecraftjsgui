export function NoWebGL2Error() {
	this.message = "It seems that your browser doesn't support WebGL2.";

	const
		div = document.createElement("div"),
		img = document.createElement("img");

	img.src = "assets/images/webgl.png";

	div.classList.add("error");
	div.append(img, this.message);

	document.body.appendChild(div);
}

NoWebGL2Error.prototype = Error.prototype;