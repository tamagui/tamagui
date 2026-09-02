export { animationPresets } from './presets'

export {
  canonicalTransitionProperty,
  easingToBezier,
  entryToCSS,
  forAnimationState,
  getMaxDurationMs,
  getSettleMs,
  getTransitionForKey,
  hasTransition,
  isTransformProperty,
  presetToTiming,
  resolveTransition,
  styleKeysForProperty,
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
