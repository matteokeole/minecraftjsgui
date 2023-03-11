import Component from "./Component.js";
import {inherits} from "../../utils/index.js";

/**
 * @extends Component
 * @param {{
 *    children: Component[]
 * }}
 */
export default function StructuralComponent({children}) {
	Component.apply(this, arguments);

	/** @returns {Component[]} */
	this.getChildren = () => children;
}

inherits(StructuralComponent, Component);