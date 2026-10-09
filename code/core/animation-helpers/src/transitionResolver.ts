import type { ResolvedTransition } from './resolveTransition'

/**
 * `getSplitStyles` needs to know whether a `transition` string is plain css or
 * needs a driver, and that answer has to come from the same grammar the
 * compiler uses. Importing the grammar into `@tamagui/web` would put the
 * parser and the spring solver in every bundle, including one with no
 * animations in it at all, which is about 3.6kb gzip of runtime nobody asked
 * for.
 *
 * So `resolveTransition` registers itself here on import. Loading any driver
 * loads it, and a bundle with no driver in it has no presets to resolve, so
 * the absent resolver is the correct answer rather than a missing one.
 *
 * The slot lives on `globalThis` because a bundler routinely gives one process
 * two copies of this module: Vite's SSR graph and its optimized-deps graph each
 * carry their own, and a module-local `let` then leaves the reader looking at
 * the copy nobody registered into. The server rendered a transition as a static
 * class while the client resolved it to a driver animation, which React reports
 * as a hydration mismatch.
 */
export type TransitionResolver = {
  resolve: (value: any, options: { animations?: any }) => ResolvedTransition
  toCSS: (resolved: ResolvedTransition) => string | undefined
}

const slot = Symbol.for('tamagui.transitionResolver')

export function setTransitionResolver(next: TransitionResolver): void {
  ;(globalThis as any)[slot] = next
}

export function getTransitionResolver(): TransitionResolver | null {
  return (globalThis as any)[slot] ?? null
}
