export function NoWebGL2Error() {
	if (!(this instanceof NoWebGL2Error)) return new NoWebGL2Error();

	this.message = "It seems that your browser doesn't support WebGL2.";
	this.stack = Error().stack;
	this.display = function() {
		const
			div = document.createElement("div"),
			img = document.createElement("img");

		img.src = "assets/images/webgl.png";

		div.classList.add("error");
		div.append(img, this.message);

		document.body.appendChild(div);
	};
}

NoWebGL2Error.prototype = Error.prototype;
NoWebGL2Error.prototype.name = "NoWebGL2Error";