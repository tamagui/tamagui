import { nativeOnlyProps } from './nativeOnlyProps'
import { webPropsToSkip } from './webPropsToSkip'

/**
 * These are props that dont pass down below Tamagui styled components
 */
export const skipProps = {
  untilMeasured: 1,
  animation: 1,
  space: 1,
  animateOnly: 1,
  disableClassName: 1,
  debug: 1,
  componentName: 1,
  disableOptimization: 1,
  tag: 1,
  style: 1, // handled after loop so pseudos set usedKeys and override it if necessary
  group: 1,
  animatePresence: 1,
}

if (process.env.NODE_ENV === 'test') {
  skipProps['data-test-renders'] = 1
}

// Skip web-only props on native
if (process.env.TAMAGUI_TARGET === 'native') {
  Object.assign(skipProps, webPropsToSkip)
}

// Skip native-only props on web
if (process.env.TAMAGUI_TARGET === 'web') {
  Object.assign(skipProps, nativeOnlyProps)
}
