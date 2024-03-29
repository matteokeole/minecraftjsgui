import {Instance as AbstractInstance} from "../src/Instance/index.js";
import {min, max} from "../src/math/index.js";
import {WebGLInstanceRenderer} from "../src/Renderer/WebGL/index.js";

export class Instance extends AbstractInstance {
	/**
	 * @param {WebGLInstanceRenderer} renderer
	 */
	constructor(renderer) {
		super(renderer);

		this._parameters = {
			...this._parameters,
			desired_scale: 0,
			max_scale: 0,
			default_width: 320,
			default_height: 240,
		};
	}

	/**
	 * @inheritdoc
	 */
	resize(viewport, dpr) {
		this.getRenderer().setViewport(viewport);

		// Calculate scale
		{
			let i = 1;

			while (viewport[2] > this.getParameter("default_width") * dpr * i && viewport[3] > this.getParameter("default_height") * dpr * i) {
				i++;
			}

			const maxScale = max(1, i - 1);
			const desiredScale = this.getParameter("desired_scale");
			const currentScale = min(maxScale, desiredScale);

			this.setParameter("max_scale", maxScale);
			this.setParameter("current_scale", currentScale);
		}

		// Update composites
		{
			const composites = this.getComposites();

			for (let i = 0, length = composites.length; i < length; i++) {
				composites[i].resize(viewport);
			}
		}
	}
}