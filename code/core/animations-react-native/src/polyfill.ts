// for SSR
if (typeof requestAnimationFrame === 'undefined') {
  globalThis['requestAnimationFrame'] =
    typeof setImmediate === 'undefined' ? setTimeout : setImmediate
}
