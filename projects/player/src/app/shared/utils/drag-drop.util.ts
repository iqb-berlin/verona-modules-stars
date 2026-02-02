/**
 * Utility to parse translate or translate3d string from a CSS transform value.
 * @param transform - The CSS transform string to parse (e.g., "translate(10px, 20px)" or "translate3d(10px, 20px, 0px)")
 * @returns An object containing the x and y coordinates in pixels
 */
export function parseTranslate(transform: string | undefined | null): { x: number, y: number } {
  if (!transform) return { x: 0, y: 0 };
  // Match both translate(x, y) and translate3d(x, y, z)
  const match = /translate(?:3d)?\(([-\d.]+)px?,\s*([-\d.]+)px?(?:,\s*[-\d.]+px?)?\)/.exec(transform);
  if (match) {
    return { x: parseFloat(match[1] ?? '0'), y: parseFloat(match[2] ?? '0') };
  }
  return { x: 0, y: 0 };
}

/**
 * Shared logic for updating a set of IDs for which transitions should be disabled.
 */
export function updateTransitionDisabledSet(
  set: Set<number>,
  id: number,
  action: 'add' | 'remove'
): Set<number> {
  if (action === 'add') {
    const newSet = new Set(set);
    newSet.add(id);
    return newSet;
  }
  if (!set.has(id)) return set;
  const newSet = new Set(set);
  newSet.delete(id);
  return newSet;
}
