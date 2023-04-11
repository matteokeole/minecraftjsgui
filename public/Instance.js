import {AbstractInstance} from "src";
import {extend} from "src/utils";
import {InstanceRenderer} from "./InstanceRenderer.js";

/** @param {InstanceRenderer} renderer */
export function Instance(renderer) {
	AbstractInstance.call(this, renderer);
}

extend(Instance, AbstractInstance);