import {InstanceRenderer} from "src";
import {ShaderSourceLoader} from "src/loader";

export class MainInstanceRenderer extends InstanceRenderer {
	/**
	 * @inheritdoc
	 */
	async build() {
		super.build();

		this._context.pixelStorei(this._context.UNPACK_FLIP_Y_WEBGL, true);
		this._context.enable(this._context.BLEND);
		this._context.blendFunc(this._context.SRC_ALPHA, this._context.ONE_MINUS_SRC_ALPHA);

		const loader = new ShaderSourceLoader(this._shaderPath);
		const vertexShaderSource = await loader.load("composite.vert");
		const fragmentShaderSource = await loader.load("composite.frag");

		const program = await this._createProgram(vertexShaderSource, fragmentShaderSource);

		this._context.useProgram(program);

		this._programs.push(program);
		this._attributes.vertex = 0;
		this._buffers.vertex = this._context.createBuffer();

		this._context.enableVertexAttribArray(this._attributes.vertex);
		this._context.bindBuffer(this._context.ARRAY_BUFFER, this._buffers.vertex);
		this._context.vertexAttribPointer(this._attributes.vertex, 2, this._context.FLOAT, false, 0, 0);
		this._context.bufferData(this._context.ARRAY_BUFFER, new Float32Array([
			 1,  1,
			-1,  1,
			-1, -1,
			 1, -1,
		]), this._context.STATIC_DRAW);

		for (let i = 0; i < this._compositeCount; i++) {
			this._context.bindTexture(this._context.TEXTURE_2D, this._textures[i] = this._context.createTexture());
			this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MIN_FILTER, this._context.LINEAR);
		}
	}

	/**
	 * @inheritdoc
	 */
	render() {
		for (let i = 0; i < this._compositeCount; i++) {
			this._context.bindTexture(this._context.TEXTURE_2D, this._textures[i]);
			this._context.drawArrays(this._context.TRIANGLE_FAN, 0, 4);
		}
	}

	/**
	 * @param {Number} index
	 * @param {OffscreenCanvas} texture
	 */
	updateCompositeTexture(index, texture) {
		this._context.bindTexture(this._context.TEXTURE_2D, this._textures[index]);
		/**
		 * @todo Replace by `texStorage2D` (lower memory costs in some implementations,
		 *       according to {@link https://registry.khronos.org/webgl/specs/latest/2.0/#3.7.6})
		 */
		this._context.texImage2D(
			this._context.TEXTURE_2D,
			0,
			this._context.RGBA,
			this._context.RGBA,
			this._context.UNSIGNED_BYTE,
			texture,
		);
	}
}