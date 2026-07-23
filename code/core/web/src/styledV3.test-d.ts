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
  test('object-first and class-first keep equivalent custom component inference', () => {
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

    const ClassFirst = styled(
      Button,
      'inline-flex items-center',
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
    type ClassProps = GetProps<typeof ClassFirst>

    expectTypeOf<ObjectProps['label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ClassProps['label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ObjectProps['disabled']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ClassProps['disabled']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ObjectProps['ref']>().toEqualTypeOf<
      ReactRef<HTMLButtonElement> | undefined
    >()
    expectTypeOf<ClassProps['ref']>().toEqualTypeOf<
      ReactRef<HTMLButtonElement> | undefined
    >()
    expectTypeOf<ObjectProps['tone']>().toEqualTypeOf<'neutral' | 'active' | undefined>()
    expectTypeOf<ClassProps['tone']>().toEqualTypeOf<'neutral' | 'active' | undefined>()
    expectTypeOf<ObjectProps['emphasis']>().toEqualTypeOf<'low' | 'high' | undefined>()
    expectTypeOf<ClassProps['emphasis']>().toEqualTypeOf<'low' | 'high' | undefined>()
    expectTypeOf<HasStringIndex<ObjectProps>>().toEqualTypeOf<false>()
    expectTypeOf<HasStringIndex<ClassProps>>().toEqualTypeOf<false>()
  })

  test('defaultVariants reject invalid values and keys in both overloads', () => {
    const validDefaults = {
      variants: buttonVariants,
      defaultVariants: {
        tone: 'neutral',
      },
    } as const satisfies ButtonStyledOptions

    styled(Button, validDefaults)
    styled(Button, 'inline-flex', validDefaults)

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
    styled(Button, 'inline-flex', invalidDefaultValue)
    styled(Button, invalidDefaultKey)
    styled(Button, 'inline-flex', invalidDefaultKey)
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
    const ClassFirst = styled(View, 'items-center', validOptions)

    type ObjectProps = GetProps<typeof ObjectFirst>
    type ClassProps = GetProps<typeof ClassFirst>
    expectTypeOf<ObjectProps['tone']>().toEqualTypeOf<'quiet' | 'strong' | undefined>()
    expectTypeOf<ClassProps['tone']>().toEqualTypeOf<'quiet' | 'strong' | undefined>()
    expectTypeOf<ObjectProps['density']>().toEqualTypeOf<
      'compact' | 'spacious' | undefined
    >()
    expectTypeOf<ClassProps['density']>().toEqualTypeOf<
      'compact' | 'spacious' | undefined
    >()
    expectTypeOf<HasStringIndex<Options>>().toEqualTypeOf<false>()
    expectTypeOf<HasStringIndex<ObjectProps>>().toEqualTypeOf<false>()
    expectTypeOf<HasStringIndex<ClassProps>>().toEqualTypeOf<false>()

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

    // @ts-expect-error direct calls keep own variant defaults closed
    styled(View, {
      variants: ownVariants,
      tone: 'missing',
    } as const)

    // @ts-expect-error direct calls do not infer arbitrary default props
    styled(View, {
      variants: ownVariants,
      unknownDefault: true,
    } as const)
  })

  test('baseClassName metadata inherits parent first', () => {
    const ParentClass = styled(
      Button,
      'parent-class',
      {
        variants: buttonVariants,
      } as const,
      {
        acceptsClassName: true,
      }
    )
    const ChildObject = styled(ParentClass, {
      variants: {
        shape: {
          pill: 'rounded-full',
        },
      },
    } as const)
    const ChildClass = styled(ParentClass, 'child-class', {
      variants: {
        shape: {
          pill: 'rounded-full',
        },
      },
    } as const)

    expectTypeOf(ChildObject.staticConfig.baseClassName).toEqualTypeOf<
      StaticStyleInput | undefined
    >()
    expectTypeOf(ChildClass.staticConfig.baseClassName).toEqualTypeOf<
      StaticStyleInput | undefined
    >()
    expect(ParentClass.staticConfig.baseClassName).toBe('parent-class')
    expect(ChildObject.staticConfig.baseClassName).toBe('parent-class')
    expect(ChildClass.staticConfig.baseClassName).toBe('parent-class child-class')
  })

  test('unknown variant props are rejected', () => {
    const ClassFirst = styled(Button, 'inline-flex', {
      variants: buttonVariants,
    } as const)

    type Props = GetProps<typeof ClassFirst>
    // @ts-expect-error unknown variant prop
    const invalid: Props['intent'] = 'neutral'
    expectTypeOf(invalid).toEqualTypeOf<any>()
  })

  test('fourth advanced static config is preserved for class-first overload', () => {
    const Advanced = styled(
      View,
      'items-center',
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
    expectTypeOf<'$4'>().toMatchTypeOf<Props['iconSize']>()
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

    styled(View, 'p-4', {
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
    styled(View, 'items-center', staticStyle)

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

    // @ts-expect-error direct styled calls keep inherited variant values closed
    styled(Parent, {
      context: FrameContext,
      contextProps: ['density'] as const,
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'missing',
          density: 'compact',
          state: 'active',
          style: {
            opacity: 0.7,
          },
        },
      ],
    })

    // @ts-expect-error direct styled calls keep new variant values closed
    styled(Parent, {
      context: FrameContext,
      contextProps: ['density'] as const,
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
          state: 'missing',
          style: {
            opacity: 0.7,
          },
        },
      ],
    })

    // @ts-expect-error direct styled calls keep context keys closed
    styled(Parent, {
      context: FrameContext,
      contextProps: ['density'] as const,
      variants: frameVariants,
      compoundVariants: [
        {
          tone: 'critical',
          density: 'compact',
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
      size: '$4' as '$4' | '$5',
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
          $4: { fontSize: '$4' },
          $5: { fontSize: '$5' },
        },
      },
    } as const)

    type Props = GetProps<typeof ContextTextChild>
    expectTypeOf<'$4'>().toMatchTypeOf<Props['size']>()
    expectTypeOf<string | undefined>().toMatchTypeOf<Props['color']>()
    expectTypeOf<Props['tone']>().toEqualTypeOf<'neutral' | 'critical' | undefined>()
    expectTypeOf<HasStringIndex<Props>>().toEqualTypeOf<false>()
  })
})
