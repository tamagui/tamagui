// the transition grammar on its own, so animation drivers can parse a
// `transition` prop without pulling in the compiler tooling entrypoint.
//
// every module reachable from here is self-contained: `shorthands/transition`
// imports nothing, and the other two import only each other and the spring
// solver. that is what keeps this cheap enough to ship to the client.

export {
  parseTransition,
  serializeTransition,
  type CSSTransitionTiming,
  type ParsedTransition,
  type PresetTransitionTiming,
  type SpringTransitionTiming,
  type TransitionBehavior,
  type TransitionDiagnostic,
  type TransitionEntry,
  type TransitionGlobalIR,
  type TransitionIR,
  type TransitionParseResult,
  type TransitionTiming,
} from './shorthands/transition'

export {
  parseTransitionObject,
  TRANSITION_RESERVED_KEYS,
  type SpringEscapeHatch,
  type TransitionObjectBase,
  type TransitionObjectValue,
} from './shorthands/transitionObject'

export {
  bounceToDampingRatio,
  dampingRatioToBounce,
  springFromDurationBounce,
  springPosition,
  springSettleTime,
  springToDurationBounce,
  springToLinearEasing,
  type SpringCanonical,
  type SpringPhysics,
} from './runtime/spring'
