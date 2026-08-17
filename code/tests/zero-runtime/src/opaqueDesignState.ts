import { getTokens } from '@tamagui/core'

/**
 * The zero-runtime negative control's independent variable.
 *
 * This is a plain `.ts` module, so it carries no JSX for the compiler to lower
 * and the compiler-local accounting has nothing to report. It still drags the
 * Tamagui runtime into the bundle, which is exactly the class of opaque path
 * that only the module-graph gate can catch.
 */
export function countSpaceTokens() {
  return Object.keys(getTokens().space).length
}
