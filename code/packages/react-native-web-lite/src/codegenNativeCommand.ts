// compat with bad imports in native

export function codegenNativeCommand() {
  console.warn(`codegenNativeCommand on web is a no-op`)
  return {}
}
