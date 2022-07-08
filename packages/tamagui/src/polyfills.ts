// for SSR
if (typeof requestAnimationFrame === 'undefined') {
  globalThis['requestAnimationFrame'] = setImmediate
}

// for vite / Animated.spring()
global.cancelAnimationFrame = (x) => {
  try {
    cancelAnimationFrame(x)
  } catch {
    // illegal invocation :/
  }
}
