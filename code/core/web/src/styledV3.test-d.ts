import React from 'react'
import type { Ref as ReactRef } from 'react'
import { describe, expect, expectTypeOf, test } from 'vitest'

import type { GetProps, StaticStyleInput } from './types'
import { styled, type StyledOptions } from './styled'
import { createStyledContext } from './helpers/createStyledContext'
import { Text } from './views/Text'
import { View } from './views/View'

type HasStringIndex<T> = string extends keyof T ? true : false

type ButtonProps = {
  label?: string
  disabled?: boolean
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(() => null)

const buttonVariants = {
  tone: {
    neutral: {
      opacity: 0.8,
    },
    active: 'opacity-100',
  },
  emphasis: {
    low: {
      scale: 0.95,
    },
    high: 'scale-100',
  },
} as const

type ButtonStyledOptions = StyledOptions<typeof Button, {}, typeof buttonVariants>

describe('styled v3 overloads', () => {
  test('displayName is a styled option and name remains an instance prop', () => {
    const Frame = styled(View, {
      displayName: 'Frame',
    })

    type Props = GetProps<typeof Frame>
    type HasDisplayNameProp = 'displayName' extends keyof Props ? true : false

    expectTypeOf<HasDisplayNameProp>().toEqualTypeOf<false>()
    expectTypeOf<Props['name']>().toMatchTypeOf<string | undefined>()
  })

  test('custom component inference survives options plus static config', () => {
    const ObjectFirst = styled(
      Button,
      {
        variants: buttonVariants,
        defaultVariants: {
          tone: 'neutral',
          emphasis: 'low',
        },
      } as const,
      {
        acceptsClassName: true,
      }
    )

    type ObjectProps = GetProps<typeof ObjectFirst>

    expectTypeOf<ObjectProps['label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ObjectProps['disabled']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ObjectProps['ref']>().toEqualTypeOf<
      ReactRef<HTMLButtonElement> | undefined
    >()
    expectTypeOf<ObjectProps['tone']>().toEqualTypeOf<'neutral' | 'active' | undefined>()
    expectTypeOf<ObjectProps['emphasis']>().toEqualTypeOf<'low' | 'high' | undefined>()
    expectTypeOf<HasStringIndex<ObjectProps>>().toEqualTypeOf<false>()
  })

  test('defaultVariants reject invalid values and keys', () => {
    const validDefaults = {
      variants: buttonVariants,
      defaultVariants: {
        tone: 'neutral',
      },
    } as const satisfies ButtonStyledOptions

    styled(Button, validDefaults)

    const invalidDefaultValue: ButtonStyledOptions = {
      variants: buttonVariants,
      defaultVariants: {
        // @ts-expect-error invalid default variant value
        tone: 'missing',
      },
    }

    const invalidDefaultKey: ButtonStyledOptions = {
      variants: buttonVariants,
      defaultVariants: {
        // @ts-expect-error invalid default variant key
        intent: 'neutral',
      },
    }

    styled(Button, invalidDefaultValue)
    styled(Button, invalidDefaultKey)
  })

  test('options accept own variant and consumed context defaults only', () => {
    type DefaultsContextProps = {
      density?: 'compact' | 'spacious'
      unconsumed?: boolean
    }
    const DefaultsContext = createStyledContext<DefaultsContextProps>()
    const ownVariants = {
      tone: {
        quiet: {
          opacity: 0.5,
        },
        strong: {
          opacity: 1,
        },
      },
    } as const
    type Options = StyledOptions<
      typeof View,
      {},
      typeof ownVariants,
      typeof DefaultsContext,
      'density'
    >

    const validOptions = {
      context: DefaultsContext,
      contextProps: ['density'],
      variants: ownVariants,
      tone: 'quiet',
      density: 'compact',
    } as const satisfies Options
    const ObjectFirst = styled(View, validOptions)

    type ObjectProps = GetProps<typeof ObjectFirst>
    expectTypeOf<ObjectProps['tone']>().toEqualTypeOf<'quiet' | 'strong' | undefined>()
    expectTypeOf<ObjectProps['density']>().toEqualTypeOf<
      'compact' | 'spacious' | undefined
    >()
    expectTypeOf<HasStringIndex<Options>>().toEqualTypeOf<false>()
    expectTypeOf<HasStringIndex<ObjectProps>>().toEqualTypeOf<false>()

    const invalidVariantValue: Options = {
      context: DefaultsContext,
      contextProps: ['density'],
      variants: ownVariants,
      // @ts-expect-error own variant defaults keep exact values
      tone: 'missing',
    }
    const invalidContextValue: Options = {
      context: DefaultsContext,
      contextProps: ['density'],
      variants: ownVariants,
      // @ts-expect-error consumed context defaults keep exact values
      density: 'dense',
    }
    const invalidUnconsumedContext: Options = {
      context: DefaultsContext,
      contextProps: ['density'],
      variants: ownVariants,
      // @ts-expect-error unconsumed context keys are not accepted defaults
      unconsumed: true,
    }
    const invalidUnknownProp: Options = {
      context: DefaultsContext,
      contextProps: ['density'],
      variants: ownVariants,
      // @ts-expect-error arbitrary defaults remain closed
      unknownDefault: true,
    }

    styled(View, invalidVariantValue)
    styled(View, invalidContextValue)
    styled(View, invalidUnconsumedContext)
    styled(View, invalidUnknownProp)

    styled(View, {
      variants: ownVariants,
      // @ts-expect-error direct calls keep own variant defaults closed
      tone: 'missing',
    } as const)

    styled(View, {
      variants: ownVariants,
      // @ts-expect-error direct calls do not infer arbitrary default props
      unknownDefault: true,
    } as const)
  })

  test('baseClassName metadata is still typed static style input', () => {
    const Child = styled(Button, {
      variants: buttonVariants,
    } as const)

    expectTypeOf(Child.staticConfig.baseClassName).toEqualTypeOf<
      StaticStyleInput | undefined
    >()
    expect(Child.staticConfig.baseClassName).toBe(undefined)
  })

  test('core styled() has no class-first overload', () => {
    // the class-string base belongs to @tamagui/tailwind's styled(), which reaches this
    // implementation through createFrontendStyled
    // @ts-expect-error a class string is not a styled() options object
    styled(View, 'p-4')
    // @ts-expect-error and not with options after it either
    styled(View, 'p-4', { variants: buttonVariants } as const)
  })

  test('unknown variant props are rejected', () => {
    const Frame = styled(Button, {
      variants: buttonVariants,
    } as const)

    type Props = GetProps<typeof Frame>
    // @ts-expect-error unknown variant prop
    const invalid: Props['intent'] = 'neutral'
    expectTypeOf(invalid).toEqualTypeOf<any>()
  })

  test('third advanced static config is preserved', () => {
    const Advanced = styled(
      View,
      {
        variants: {
          tone: {
            quiet: 'opacity-50',
          },
        },
      } as const,
      {
        accept: {
          iconSize: 'size',
        },
        neverFlatten: 'jsx',
      } as const
    )

    type Props = GetProps<typeof Advanced>
    expectTypeOf<Props['tone']>().toEqualTypeOf<'quiet' | undefined>()
    expectTypeOf<'4'>().toMatchTypeOf<Props['iconSize']>()
  })

  test('static class strings are typed as static style input leaves only', () => {
    const leaf: StaticStyleInput = 'opacity-100'
    expectTypeOf(leaf).toEqualTypeOf<StaticStyleInput>()

    styled(View, {
      variants: {
        tone: {
          quiet: leaf,
        },
      },
    } as const)
  })

  test('context keys without defaults are typed consumed props for compounds', () => {
    type FrameContextProps = {
      tone?: 'critical' | 'neutral'
      density?: 'compact' | 'spacious'
    }
    type OneKeyContextProps = {
      tone?: 'critical' | 'neutral'
    }
    type RequiredToneContextProps = {
      tone: 'critical' | 'neutral'
    }
    type RequiredUndefinedToneContextProps = {
      tone: 'critical' | 'neutral' | undefined
    }
    const FrameContext = createStyledContext<FrameContextProps>()
    // @ts-expect-error undefined-default contexts with consumed-key generics require keys
    createStyledContext<FrameContextProps, 'tone'>(undefined, {
      namespace: 'missing-keys',
    })
    // @ts-expect-error explicit broad default objects must provide every claimed key
    createStyledContext<FrameContextProps>({
      tone: 'critical',
    })
    createStyledContext<FrameContextProps>(
      // @ts-expect-error full default keys require an explicit consumed-key generic
      {
        tone: 'critical',
        density: 'compact',
      },
      {
        keys: ['tone'],
      }
    )
    createStyledContext<FrameContextProps>(
      // @ts-expect-error full default empty keys still require an explicit consumed-key generic
      {
        tone: 'critical',
        density: 'compact',
      },
      {
        keys: [],
      }
    )
    const PresentUndefinedContext = createStyledContext<OneKeyContextProps>({
      tone: undefined,
    })
    // @ts-expect-error required keys cannot default to undefined unless their type allows it
    createStyledContext<RequiredToneContextProps>({
      tone: undefined,
    })
    const RequiredUndefinedContext =
      createStyledContext<RequiredUndefinedToneContextProps>({
        tone: undefined,
      })
    const EmptyDefaultContext = createStyledContext<FrameContextProps>({})
    // @ts-expect-error keyed empty defaults require an explicit consumed-key generic
    createStyledContext<FrameContextProps>({}, { keys: ['tone'] })
    const EmptyDefaultKeyedContext = createStyledContext<FrameContextProps, 'tone'>(
      {},
      {
        keys: ['tone'],
      }
    )
    const PartialDefaultContext = createStyledContext<FrameContextProps, 'tone'>(
      {
        tone: 'critical',
      },
      {
        keys: ['tone'],
      }
    )
    const FullDefaultKeyedContext = createStyledContext<FrameContextProps, 'tone'>(
      {
        tone: 'critical',
        density: 'compact',
      },
      {
        keys: ['tone'],
      }
    )
    const frameVariants = {
      state: {
        active: {},
        selected: {},
      },
    } as const
    type FrameOptions = StyledOptions<
      typeof View,
      {},
      typeof frameVariants,
      typeof FrameContext,
      'tone' | 'density'
    >

    const validOptions = {
      context: FrameContext,
      contextProps: ['tone', 'density'],
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: ['compact', 'spacious'],
          state: 'active',
          style: {
            opacity: 0.8,
          },
        },
      ],
    } as const satisfies FrameOptions

    const Frame = styled(View, validOptions)
    type Props = GetProps<typeof Frame>

    expectTypeOf<Props['tone']>().toEqualTypeOf<'critical' | 'neutral' | undefined>()
    expectTypeOf<Props['density']>().toEqualTypeOf<'compact' | 'spacious' | undefined>()
    expectTypeOf<Props['state']>().toEqualTypeOf<'active' | 'selected' | undefined>()
    expectTypeOf<HasStringIndex<Props>>().toEqualTypeOf<false>()

    const invalidTone: FrameOptions = {
      context: FrameContext,
      contextProps: ['tone', 'density'],
      variants: frameVariants,
      compoundVariants: [
        {
          // @ts-expect-error invalid context matcher value
          tone: 'missing',
          state: 'active',
          style: {
            opacity: 0.8,
          },
        },
      ],
    }

    const staticStyle: FrameOptions = {
      context: FrameContext,
      contextProps: ['tone', 'density'],
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          state: 'active',
          style: 'opacity-100',
        },
      ],
    }

    styled(View, invalidTone)
    styled(View, staticStyle)

    const ContextOnly = styled(View, {
      context: FrameContext,
    } as const)
    type ContextOnlyProps = GetProps<typeof ContextOnly>
    expectTypeOf<HasStringIndex<ContextOnlyProps>>().toEqualTypeOf<false>()
    // @ts-expect-error no-default contexts do not become props without contextProps
    const ignoredContextProp: ContextOnlyProps['tone'] = 'critical'
    expectTypeOf(ignoredContextProp).toEqualTypeOf<any>()

    const DefaultContext = createStyledContext({
      mode: 'on' as 'on' | 'off',
    })
    const DefaultContextFrame = styled(View, {
      context: DefaultContext,
    } as const)
    type DefaultContextProps = GetProps<typeof DefaultContextFrame>
    expectTypeOf<DefaultContextProps['mode']>().toEqualTypeOf<'on' | 'off' | undefined>()

    const EmptyDefaultFrame = styled(View, {
      context: EmptyDefaultContext,
    } as const)
    type EmptyDefaultProps = GetProps<typeof EmptyDefaultFrame>
    // @ts-expect-error empty default contexts consume no optional keys
    const emptyDefaultTone: EmptyDefaultProps['tone'] = 'critical'
    expectTypeOf(emptyDefaultTone).toEqualTypeOf<any>()

    const PresentUndefinedFrame = styled(View, {
      context: PresentUndefinedContext,
    } as const)
    type PresentUndefinedProps = GetProps<typeof PresentUndefinedFrame>
    expectTypeOf<PresentUndefinedProps['tone']>().toEqualTypeOf<
      'critical' | 'neutral' | undefined
    >()
    // @ts-expect-error present undefined default keys keep exact values
    const invalidPresentUndefinedTone: PresentUndefinedProps['tone'] = 'missing'
    expectTypeOf(invalidPresentUndefinedTone).toEqualTypeOf<
      'critical' | 'neutral' | undefined
    >()

    const RequiredUndefinedFrame = styled(View, {
      context: RequiredUndefinedContext,
    } as const)
    type RequiredUndefinedProps = GetProps<typeof RequiredUndefinedFrame>
    expectTypeOf<RequiredUndefinedProps['tone']>().toEqualTypeOf<
      'critical' | 'neutral' | undefined
    >()

    const EmptyDefaultKeyedFrame = styled(View, {
      context: EmptyDefaultKeyedContext,
    } as const)
    type EmptyDefaultKeyedProps = GetProps<typeof EmptyDefaultKeyedFrame>
    expectTypeOf<EmptyDefaultKeyedProps['tone']>().toEqualTypeOf<
      'critical' | 'neutral' | undefined
    >()

    const FullDefaultKeyedFrame = styled(View, {
      context: FullDefaultKeyedContext,
    } as const)
    type FullDefaultKeyedProps = GetProps<typeof FullDefaultKeyedFrame>
    expectTypeOf<FullDefaultKeyedProps['tone']>().toEqualTypeOf<
      'critical' | 'neutral' | undefined
    >()
    // @ts-expect-error explicit full-default keys consume only requested keys
    const fullDefaultKeyedDensity: FullDefaultKeyedProps['density'] = 'compact'
    expectTypeOf(fullDefaultKeyedDensity).toEqualTypeOf<any>()

    const PartialDefaultFrame = styled(View, {
      context: PartialDefaultContext,
    } as const)
    type PartialDefaultProps = GetProps<typeof PartialDefaultFrame>
    expectTypeOf<PartialDefaultProps['tone']>().toEqualTypeOf<
      'critical' | 'neutral' | undefined
    >()
    // @ts-expect-error omitted optional default keys are not consumed without explicit keys
    const omittedPartialDefaultProp: PartialDefaultProps['density'] = 'compact'
    expectTypeOf(omittedPartialDefaultProp).toEqualTypeOf<any>()

    const AnyContext = createStyledContext<any>()
    const AnyContextFrame = styled(View, {
      context: AnyContext,
    } as const)
    type AnyContextProps = GetProps<typeof AnyContextFrame>
    expectTypeOf<HasStringIndex<AnyContextProps>>().toEqualTypeOf<false>()
    // @ts-expect-error broad StyledContext<any> does not add arbitrary props
    const anyContextProp: AnyContextProps['anything'] = 'value'
    expectTypeOf(anyContextProp).toEqualTypeOf<any>()

    const Parent = styled(View, {
      variants: {
        tone: {
          critical: {},
          neutral: {},
        },
      },
    } as const)

    const OverlapChild = styled(Parent, {
      variants: {
        tone: {
          success: {},
        },
      },
      compoundVariants: [
        {
          tone: 'critical',
          style: {
            opacity: 0.4,
          },
        },
        {
          tone: 'success',
          style: {
            opacity: 0.8,
          },
        },
      ],
    } as const)
    type OverlapProps = GetProps<typeof OverlapChild>
    expectTypeOf<OverlapProps['tone']>().toEqualTypeOf<
      'critical' | 'neutral' | 'success' | undefined
    >()

    const Child = styled(Parent, {
      context: FrameContext,
      contextProps: ['density'],
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
          state: 'active',
          style: {
            opacity: 0.7,
          },
        },
      ],
    } as const)
    type ChildProps = GetProps<typeof Child>
    expectTypeOf<ChildProps['tone']>().toEqualTypeOf<'critical' | 'neutral' | undefined>()
    expectTypeOf<ChildProps['density']>().toEqualTypeOf<
      'compact' | 'spacious' | undefined
    >()
    expectTypeOf<ChildProps['state']>().toEqualTypeOf<'active' | 'selected' | undefined>()

    styled(Parent, {
      context: FrameContext,
      contextProps: ['density'] as const,
      variants: frameVariants,
      compoundVariants: [
        {
          // @ts-expect-error direct styled calls keep inherited variant values closed
          tone: 'missing',
          density: 'compact',
          state: 'active',
          style: {
            opacity: 0.7,
          },
        },
      ],
    })

    styled(Parent, {
      context: FrameContext,
      contextProps: ['density'] as const,
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
          // @ts-expect-error direct styled calls keep new variant values closed
          state: 'missing',
          style: {
            opacity: 0.7,
          },
        },
      ],
    })

    styled(Parent, {
      context: FrameContext,
      contextProps: ['density'] as const,
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
          // @ts-expect-error direct styled calls keep context keys closed
          mood: 'serious',
          state: 'active',
          style: {
            opacity: 0.7,
          },
        },
      ],
    })

    type ChildOptions = StyledOptions<
      typeof Parent,
      {},
      typeof frameVariants,
      typeof FrameContext,
      'density'
    >

    const invalidInheritedVariant: ChildOptions = {
      context: FrameContext,
      contextProps: ['density'],
      variants: frameVariants,
      compoundVariants: [
        {
          // @ts-expect-error inherited variant values stay closed
          tone: 'missing',
          density: 'compact',
          state: 'active',
          style: {
            opacity: 0.7,
          },
        },
      ],
    }
    const invalidNewVariant: ChildOptions = {
      context: FrameContext,
      contextProps: ['density'],
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
          // @ts-expect-error new variant values stay closed
          state: 'missing',
          style: {
            opacity: 0.7,
          },
        },
      ],
    }
    const invalidUnconsumedContext: ChildOptions = {
      context: FrameContext,
      contextProps: ['density'],
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
          // @ts-expect-error context props must be explicitly consumed by styled
          mood: 'serious',
          state: 'active',
          style: {
            opacity: 0.7,
          },
        },
      ],
    }

    styled(Parent, invalidInheritedVariant)
    styled(Parent, invalidNewVariant)
    styled(Parent, invalidUnconsumedContext)
  })

  test('context keys already accepted by a parent stay on one prop path', () => {
    const TextContext = createStyledContext({
      size: '4' as '4' | '5',
      color: undefined as string | undefined,
      tone: 'neutral' as 'neutral' | 'critical',
    })
    const ContextText = styled(Text, {
      context: TextContext,
      variants: {
        plain: {
          false: {},
        },
      },
    } as const)
    const ContextTextChild = styled(ContextText, {
      context: TextContext,
      variants: {
        size: {
          4: { fontSize: '4' },
          5: { fontSize: '5' },
        },
      },
    } as const)

    type Props = GetProps<typeof ContextTextChild>
    expectTypeOf<'4'>().toMatchTypeOf<Props['size']>()
    expectTypeOf<string | undefined>().toMatchTypeOf<Props['color']>()
    expectTypeOf<Props['tone']>().toEqualTypeOf<'neutral' | 'critical' | undefined>()
    expectTypeOf<HasStringIndex<Props>>().toEqualTypeOf<false>()
  })
})
