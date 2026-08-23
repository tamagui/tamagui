// minimal animation driver for exercising createComponent's driver-facing
// contract (avoidReRenders emitter path, animatedBy switching) without pulling
// a real driver (motion/reanimated) into the test env. every hook-shaped field
// uses zero react hooks so two mock drivers always have identical hook counts.
import type { AnimationDriverWithAnimatedNumbers } from '../web/src'

export type EmittedStyle = {
  style: Record<string, unknown>
  transition?: unknown
}

export function createMockAnimationDriver(options?: {
  avoidReRenders?: boolean
  inputStyle?: 'css' | 'value'
  emissions?: EmittedStyle[]
}): AnimationDriverWithAnimatedNumbers {
  const emissions = options?.emissions
  return {
    isReactNative: false,
    inputStyle: options?.inputStyle ?? 'value',
    outputStyle: 'inline',
    avoidReRenders: options?.avoidReRenders ?? false,
    animations: {} as any,
    useAnimations: ({ style, useStyleEmitter }) => {
      useStyleEmitter?.((nextStyle, effectiveTransition) => {
        emissions?.push({ style: nextStyle, transition: effectiveTransition })
      })
      return { style }
    },
    usePresence: () => [true, null, null] as any,
    ResetPresence: ({ children }) => children,
    useAnimatedNumber: (() => {
      throw new Error('not implemented in mock driver')
    }) as any,
    useAnimatedNumberStyle: (() => {
      throw new Error('not implemented in mock driver')
    }) as any,
    useAnimatedNumbersStyle: (() => {
      throw new Error('not implemented in mock driver')
    }) as any,
    useAnimatedNumberReaction: (() => {
      throw new Error('not implemented in mock driver')
    }) as any,
  }
}
