// for SSR
if (typeof requestAnimationFrame === 'undefined') {
  globalThis['requestAnimationFrame'] = setTimeout
}

// for reanimated
if (typeof global === 'undefined') {
  globalThis['global'] = globalThis
}
