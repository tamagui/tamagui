// dont import things

export const isWeb = process.env.TARGET === 'web'
export const isWebIOS =
  isWeb &&
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream

export const supportsTouchWeb = typeof window !== 'undefined' && 'ontouchstart' in window
export const isTouchDevice = !isWeb || supportsTouchWeb
