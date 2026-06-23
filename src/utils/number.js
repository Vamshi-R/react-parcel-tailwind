/**
 * Clamp a number between a minimum and maximum value.
 * @param {number} value - The value to clamp.
 * @param {number} min - The lower bound.
 * @param {number} max - The upper bound.
 * @returns {number} The clamped value.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format a number with thousands separators using the current locale.
 * @param {number} value - The number to format.
 * @returns {string} The formatted number.
 */
export function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}
