import {Layer} from "src/gui";
import {extend} from "src/utils";

export default function TestLayer() {
	Layer.call(this);

	/** @override */
	this.build = () => [];
}

extend(TestLayer, Layer);