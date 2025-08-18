// compat with bad imports in native

export default function codegenNativeComponent() {
  console.warn(`codegenNativeComponent on web is a no-op`)
  return {}
}
