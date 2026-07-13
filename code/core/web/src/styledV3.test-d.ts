import React from 'react'
import type { Ref as ReactRef } from 'react'
import { describe, expect, expectTypeOf, test } from 'vitest'

import type { GetProps, StaticStyleInput } from './types'
import { styled, type StyledOptions } from './styled'
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
    expectTypeOf<ObjectProps['tone']>().toEqualTypeOf<
      'neutral' | 'active' | undefined
    >()
    expectTypeOf<ClassProps['tone']>().toEqualTypeOf<
      'neutral' | 'active' | undefined
    >()
    expectTypeOf<ObjectProps['emphasis']>().toEqualTypeOf<
      'low' | 'high' | undefined
    >()
    expectTypeOf<ClassProps['emphasis']>().toEqualTypeOf<
      'low' | 'high' | undefined
    >()
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
})
