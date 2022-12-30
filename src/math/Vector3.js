/**
 * Tri-dimensional vector class.
 * 
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @throws {TypeError}
 */
export function Vector3(x, y, z) {
	const {length} = arguments;

	if (length < 3) throw TypeError(`Failed to construct 'Vector3': 3 arguments required, but only ${length} present.`);

	this.x = x;
	this.y = y;
	this.z = z;
}

/**
 * @param {Vector3} v
 */
Vector3.prototype.add = function(v) {
	return new Vector3(
		this.x + v.x,
		this.y + v.y,
		this.z + v.z,
	);
};

/**
 * @param {Number} n
 */
Vector3.prototype.addScalar = function(n) {
	return new Vector3(
		this.x + n,
		this.y + n,
		this.z + n,
	);
};

Vector3.prototype.clone = function() {
	return new Vector3(
		this.x,
		this.y,
	);
};

/**
 * @param {Vector3} v
 */
Vector3.prototype.cross = function(v) {
	return new Vector3(
		this.y * v.z - this.z * v.y,
		this.z * v.x - this.x * v.z,
		this.x * v.y - this.y * v.x,
	);
};

/**
 * @param {Vector3} v
 */
Vector3.prototype.distanceTo = function(v) {
	return Math.sqrt(
		(v.x - this.x) ** 2 +
		(v.y - this.y) ** 2 +
		(v.z - this.z) ** 2,
	);
};

/**
 * @param {Vector3} v
 * @throws {RangeError}
 */
Vector3.prototype.divide = function(v) {
	if (v.x === 0 || v.y === 0 || v.z === 0) throw RangeError("Division by zero");

	return new Vector3(
		this.x / v.x,
		this.y / v.y,
		this.z / v.z,
	);
};

/**
 * @param {Number} n
 * @throws {RangeError}
 */
Vector3.prototype.divideScalar = function(n) {
	if (n === 0) throw RangeError("Division by zero");

	return this.multiplyScalar(1 / n);
};

/**
 * @param {Vector3} v
 */
Vector3.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y + this.z * v.z;
};

/**
 * NOTE: Only for 32-bit signed integers.
 */
Vector3.prototype.floor = function() {
	return new Vector3(
		this.x | 0,
		this.y | 0,
		this.z | 0,
	);
};

Vector3.prototype.invert = function() {
	return this.multiplyScalar(-1);
};

Vector3.prototype.length = function() {
	return Math.sqrt(this.lengthSquared());
};

Vector3.prototype.lengthSquared = function() {
	return this.x ** 2 + this.y ** 2 + this.z ** 2;
};

/**
 * @param {Vector3} v
 * @param {Number} n
 */
Vector3.prototype.lerp = function(v, n) {
	const a = this.multiplyScalar(1 - n);
	const b = v.multiplyScalar(n);

	return a.add(b);
};

/**
 * @param {Vector3} v
 */
Vector3.prototype.multiply = function(v) {
	return new Vector3(
		this.x * v.x,
		this.y * v.y,
		this.z * v.z,
	);
};

/**
 * @param {Number} n
 */
Vector3.prototype.multiplyScalar = function(n) {
	return new Vector3(
		this.x * n,
		this.y * n,
		this.z * n,
	);
};

Vector3.prototype.normalize = function() {
	const length = this.length();

	if (length <= .00001) return new Vector3();

	return this.divideScalar(length);
};

Vector3.prototype.randomize = function() {
	return new Vector3(
		Math.random(),
		Math.random(),
		Math.random(),
	);
};

/**
 * @param {Vector3} v
 */
Vector3.prototype.substract = function(v) {
	return new Vector3(
		this.x - v.x,
		this.y - v.y,
		this.z - v.z,
	);
};

/**
 * @param {Number} n
 */
Vector3.prototype.substractScalar = function(n) {
	return this.addScalar(-n);
};

Vector3.prototype.toArray = function() {
	return [
		this.x,
		this.y,
		this.z,
	];
};