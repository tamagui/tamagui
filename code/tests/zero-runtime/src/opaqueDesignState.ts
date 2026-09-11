/**
 * The module-graph gate's independent variable.
 *
 * The Tamagui runtime is reached through a dynamic import, so there is no static
 * import declaration for the compiler-local accounting to attribute. The bundler
 * still puts `@tamagui/core` in the graph, which is exactly the class of opaque
 * path only the second gate can catch.
 */
export async function countSpaceTokens() {
  const { getTokens } = await import('@tamagui/core')
  return Object.keys(getTokens().space).length
}
