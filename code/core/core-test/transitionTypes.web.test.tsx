process.env.TAMAGUI_TARGET = 'web'

import { describe, expectTypeOf, test } from 'vitest'
import { createTamagui, type AnimationDriver, type InferTamaguiConfig } from '../core/src'
import config from '../config-default'

describe('transition type inference', () => {
  test('InferTamaguiConfig extracts animation keys from AnimationDriver', () => {
    const tamaConf = createTamagui(config.getDefaultTamaguiConfig())

    // Test that the config type properly infers animation keys
    type ConfigType = typeof tamaConf
    type AnimationsType = ConfigType['animations']

    // AnimationsType should be AnimationDriver<Config> where Config has our animation keys
    // The 'animations' property on the driver should have the animation names as keys
    type AnimationNames = keyof AnimationsType['animations']

    // These should all be valid animation names from config-default
    type TestBouncy = 'bouncy' extends AnimationNames ? true : false
    type TestLazy = 'lazy' extends AnimationNames ? true : false
    type Test100ms = '100ms' extends AnimationNames ? true : false

    // Verify the types are 'true' (animation keys are properly inferred)
    expectTypeOf<TestBouncy>().toEqualTypeOf<true>()
    expectTypeOf<TestLazy>().toEqualTypeOf<true>()
    expectTypeOf<Test100ms>().toEqualTypeOf<true>()

    // This should be false - 'invalidKey' is not in the animation config
    type TestInvalid = 'invalidKey' extends AnimationNames ? true : false
    expectTypeOf<TestInvalid>().toEqualTypeOf<false>()
  })

  test('ExtractAnimationConfig properly extracts config from AnimationDriver', () => {
    // Test the type extraction directly
    type TestDriver = AnimationDriver<{
      fast: { type: 'spring' }
      slow: { type: 'timing' }
    }>

    // The driver's animations property should have our keys
    type Keys = keyof TestDriver['animations']

    type HasFast = 'fast' extends Keys ? true : false
    type HasSlow = 'slow' extends Keys ? true : false

    expectTypeOf<HasFast>().toEqualTypeOf<true>()
    expectTypeOf<HasSlow>().toEqualTypeOf<true>()
  })
})
