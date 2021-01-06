// dont import things

export const isWeb =
  !process.env.TARGET ||
  process.env.TARGET === 'web' ||
  process.env.TARGET === 'ssr'
export const isWebIOS =
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream
