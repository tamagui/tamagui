/**
 * Composed resolver for variant-driven Tailwind utilities.
 *
 * This replaces the imperative compose.ts ring/gradient/filter/shadow logic
 * with a single `.resolve()` function that runs after all className-resolved
 * variant props are collected. It composes N-to-1 mappings like:
 *
 *   ring=2 + ringColor='blue' + ringInset=true → boxShadow: 'inset 0 0 0 2px blue'
 *
 * Because `.resolve()` runs once after ALL props are gathered, there's no
 * ordering issue — it sees the complete picture.
 */

/**
 * The resolver function passed to `.resolve()` on tailwind View/Text.
 * Receives merged props (original + className-resolved) and produces
 * composed style values.
 */
export function composedResolver(
  props: Record<string, any>,
  _env: any
): Record<string, any> | null | undefined {
  let result: Record<string, any> | null = null

  // ── Ring utilities ──────────────────────────────────────────────────
  // ring-2 ring-blue-500 ring-inset → boxShadow
  if (props.__ring != null) {
    const inset = props.__ringInset ? 'inset ' : ''
    const color = props.__ringColor ?? 'currentColor'
    const width = props.__ring
    const ringValue = `${inset}0 0 0 ${width} ${color}`

    // Stack with existing boxShadow (from shadow-* utilities)
    const existingShadow = props.__existingShadow
    ;(result ??= {}).boxShadow = existingShadow
      ? `${ringValue}, ${existingShadow}`
      : ringValue
  }

  // ── Inset ring utilities ────────────────────────────────────────────
  if (props.__insetRingWidth != null) {
    const color = props.__insetRingColor ?? 'currentColor'
    const insetRing = `inset 0 0 0 ${props.__insetRingWidth} ${color}`
    ;(result ??= {}).boxShadow = result?.boxShadow
      ? `${insetRing}, ${result.boxShadow}`
      : insetRing
  }

  // ── Gradient utilities ──────────────────────────────────────────────
  // bg-linear-to-r from-red via-yellow to-blue → backgroundImage
  if (props.__gradientDirection && (props.__gradientFrom || props.__gradientVia || props.__gradientTo)) {
    const from = props.__gradientFrom ?? 'transparent'
    const to = props.__gradientTo ?? 'transparent'
    const via = props.__gradientVia
    ;(result ??= {}).backgroundImage = via
      ? `linear-gradient(${props.__gradientDirection}, ${from}, ${via}, ${to})`
      : `linear-gradient(${props.__gradientDirection}, ${from}, ${to})`
  }

  return result
}
