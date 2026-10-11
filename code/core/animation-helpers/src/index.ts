export { animationPresets } from './presets'

export {
  canonicalTransitionProperty,
  isTransformProperty,
  styleKeysForProperty,
} from './propertyNames'

export {
  getTransitionResolver,
  setTransitionResolver,
  type TransitionResolver,
} from './transitionResolver'

export {
  easingToBezier,
  entryToCSS,
  forAnimationState,
  getMaxDurationMs,
  getSettleMs,
  getTransitionForKey,
  hasTransition,
  presetToTiming,
  resolveTransition,
  toCSSTransition,
} from './resolveTransition'

export type {
  DriverTiming,
  ResolvedEntry,
  ResolvedTransition,
  ResolveTransitionOptions,
} from './resolveTransition'

export type {
  AnimationConfig,
  AnimationsConfig,
  PresetConfig,
  TransitionPropInput,
} from './types'
