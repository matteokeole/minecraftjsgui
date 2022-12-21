/**
 * Clamps `n` between the range [`min`, `max`].
 * 
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(n, min, max) {
	n < min && (n = min);
	n > max && (n = max);

	return n;
}

/**
 * Clamps `n` down with a minimum value of `min`.
 * 
 * @param {number} n
 * @param {number} min
 * @returns {number}
 */
export const clampDown = (n, min) => n < min ? min : n;

/**
 * Clamps `n` up with a maximum value of `max`.
 * 
 * @param {number} n
 * @param {number} max
 * @returns {number}
 */
export const clampUp = (n, max) => n > max ? max : n;