/**
 * Clamps `n` between the range [`min`, `max`].
 * 
 * @param {Number} n
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function clamp(n, min, max) {
	n < min && (n = min);
	n > max && (n = max);

	return n;
}

/**
 * Clamps `n` down with a minimum value of `min`.
 * 
 * @param {Number} n
 * @param {Number} min
 * @returns {Number}
 */
export const clampDown = (n, min) => n < min ? min : n;

/**
 * Clamps `n` up with a maximum value of `max`.
 * 
 * @param {Number} n
 * @param {Number} max
 * @returns {Number}
 */
export const clampUp = (n, max) => n > max ? max : n;