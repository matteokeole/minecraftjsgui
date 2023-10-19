import {StructuralComponent} from "src/gui/components";
import {extend} from "src/utils";

/** @extends StructuralComponent */
export function Group() {
	StructuralComponent.apply(this, arguments);
}

extend(Group, StructuralComponent);