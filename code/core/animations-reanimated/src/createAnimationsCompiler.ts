import type { AnimationDriver } from '@tamagui/core'
import type { TransitionConfig } from './createAnimations'

/**
 * The reanimated driver as the compiler sees it.
 *
 * Evaluating a config runs `createTamagui({ animations })`, which calls the
 * driver factory. The real one imports Animated, useSharedValue, withTiming and
 * friends from react-native-reanimated at module scope, so merely loading a
 * config drags the whole native runtime into whatever is doing the evaluating.
 *
 * That runtime cannot load outside an app. react-native-reanimated ships ESM
 * with extensionless relative imports and directory imports
 * (`import './publicGlobals'`, `import './ReanimatedModule'`), which a bundler
 * resolves and node's ESM loader does not. Evaluating a config that registered
 * this driver used to fail with ERR_MODULE_NOT_FOUND or "Directory import is
 * not supported", which took the dev server down and left the compiler's
 * `.tamagui/tamagui.config.json` artifact stale, so editor completions and
 * colour swatches went stale with it.
 *
 * Nothing the compiler reads off a driver needs that runtime. It reads the
 * `animations` record and the static flags below; everything else is hooks and
 * components that only ever run inside an app. So this returns exactly that,
 * with the animation configs normalized identically to the real driver, and
 * inert placeholders for the runtime surface.
 *
 * Selected through the `tamagui-compiler` export condition rather than by any
 * user configuration, so every bundler integration opts in the same way and an
 * app never has to know this file exists. The type import above is erased, so
 * this module never pulls in the real driver.
 */

// same deep clone the real driver applies, duplicated rather than imported
// because importing it would load the module this file exists to avoid.
const cloneAnimationValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(cloneAnimationValue)
  }

  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {}
    for (const key in value as Record<string, unknown>) {
      next[key] = cloneAnimationValue((value as Record<string, unknown>)[key])
    }
    return next
  }

  return value
}

const unavailable = (name: string) => () => {
  throw new Error(
    `@tamagui/animations-reanimated: ${name} ran during config evaluation. ` +
      `Only the compiler resolves this build, and it never renders or runs hooks. ` +
      `Reaching it from an app means the "tamagui-compiler" export condition is ` +
      `being applied outside the compiler's evaluation environment.`
  )
}

export function createAnimations<A extends Record<string, TransitionConfig>>(
  animationsConfig: A
): AnimationDriver<A> {
  // identical normalization to the real driver: default to spring, deep clone,
  // so the compiler reads back exactly the values an app would.
  const animations = {} as A
  for (const key in animationsConfig) {
    animations[key] = cloneAnimationValue({
      type: 'spring',
      ...animationsConfig[key],
    }) as A[typeof key]
  }

  return {
    needsCustomComponent: true,
    View: 'ReanimatedViewCompilerStub',
    Text: 'ReanimatedTextCompilerStub',
    inputStyle: 'value',
    outputStyle: 'inline',
    avoidReRenders: true,
    animations,
    usePresence: unavailable('usePresence'),
    ResetPresence: unavailable('ResetPresence'),
    useAnimatedNumber: unavailable('useAnimatedNumber'),
    useAnimatedNumberReaction: unavailable('useAnimatedNumberReaction'),
    useAnimatedNumberStyle: unavailable('useAnimatedNumberStyle'),
    useAnimatedNumbersStyle: unavailable('useAnimatedNumbersStyle'),
    useAnimations: unavailable('useAnimations'),
  } as unknown as AnimationDriver<A>
}
