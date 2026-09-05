import { getStableLayoutViewportHeight } from './webViewport'

/**
 * Height of the viewport the sheet positions against.
 *
 * This MUST be the stable layout viewport: the visual viewport shrinks by the
 * soft keyboard, and capping frameSize / maxContentSize against a shrinking
 * value corrupts the fit-mode math (translateY = screenSize - frameSize),
 * detaching the sheet's bottom from the screen edge when the keyboard opens.
 * NOTE: window.innerHeight is NOT stable on real iOS Safari (it shrinks with
 * the keyboard too), hence the self-correcting baseline in webViewport.
 */
export function getStableViewportHeight(): number {
  return getStableLayoutViewportHeight()
}
