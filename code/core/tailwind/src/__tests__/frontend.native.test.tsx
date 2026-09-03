import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { safeAreaVariableNames } from '@tamagui/style-grammar/runtime'
import { View as CoreView, createTamagui, getConfig } from '@tamagui/web'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'

import { getTailwindClassPlan } from '../candidate'
import { tailwindStyleFrontend } from '../frontend'
import { Text, View, styled } from '../index'
import { splitTailwindStyles, styleOf } from './utils'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig('native') as any)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('claimed candidates resolve to native style values', () => {
  test('a token candidate resolves through the config', () => {
    const styles = splitTailwindStyles(View, { className: 'p-4' })
    const expected = getConfig().tokensParsed.space['4'].val

    expect(styleOf(styles).paddingTop).toBe(expected)
    expect(styleOf(styles).paddingLeft).toBe(expected)
  })

  test('tailwind half-step classes resolve the configured space token', () => {
    const styles = splitTailwindStyles(View, { className: 'p-0.5' })
    const space = getConfig().tokensParsed.space
    const expected = (space['0.5'] ?? space['0-5']).val

    expect(styleOf(styles).paddingTop).toBe(expected)
    expect(styleOf(styles).paddingLeft).toBe(expected)
  })

  test('rotate-45 becomes a native rotate string', () => {
    const styles = splitTailwindStyles(View, { className: 'rotate-45' })
    const transform = styleOf(styles).transform
    const rotate =
      styleOf(styles).rotate ??
      (Array.isArray(transform)
        ? transform.find((item) => item?.rotate)?.rotate
        : undefined)

    expect(rotate).toBe('45deg')
  })

  test('gradient classes resolve to a native backgroundImage string', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-linear-to-r from-[red] to-[blue]',
    })

    expect(styleOf(styles).experimental_backgroundImage).toEqual([
      {
        type: 'linear-gradient',
        direction: 'to right',
        colorStops: [{ color: 'red' }, { color: 'blue' }],
      },
    ])
  })

  test('ring classes resolve to native boxShadow and leave outline alone', () => {
    const styles = splitTailwindStyles(View, {
      className: 'outline-2 ring-2 ring-[blue]',
    })

    expect(styleOf(styles).outlineWidth).toBe(getConfig().tokensParsed.space['2'].val)
    expect(styleOf(styles).boxShadow).toEqual([
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: 'blue',
      },
    ])
  })

  test('outline classes resolve to native outline longhands', () => {
    const styles = splitTailwindStyles(View, {
      className: 'outline-2 outline-solid outline-[red] outline-offset-2',
    })
    const space = getConfig().tokensParsed.space

    expect(styleOf(styles).outlineWidth).toBe(space['2'].val)
    expect(styleOf(styles).outlineStyle).toBe('solid')
    expect(styleOf(styles).outlineColor).toBe('red')
    expect(styleOf(styles).outlineOffset).toBe(space['2'].val)
  })

  test('inset fractions become percentages', () => {
    const styles = splitTailwindStyles(View, { className: 'inset-1/2' })

    expect(styleOf(styles).top).toBe('50%')
    expect(styleOf(styles).left).toBe('50%')
  })

  test('a px arbitrary becomes a number, which is what react native accepts', () => {
    const styles = splitTailwindStyles(View, { className: 'w-[400px]' })

    expect(styleOf(styles).width).toBe(400)
  })

  test('font size stays numeric on native', () => {
    const styles = splitTailwindStyles(Text, { className: 'text-[14px]' })

    expect(styleOf(styles).fontSize).toBe(14)
  })

  test('safe-area length candidates use the live native value', () => {
    const globalState = globalThis as typeof globalThis & {
      __tamagui_safe_area__?: {
        didSetup: boolean
        enabled: boolean
        initialMetrics: {
          insets: { top: number; right: number; bottom: number; left: number }
          frame: { x: number; y: number; width: number; height: number }
        }
      }
    }
    const previousState = globalState.__tamagui_safe_area__
    globalState.__tamagui_safe_area__ = {
      didSetup: true,
      enabled: true,
      initialMetrics: {
        insets: { top: 31, right: 0, bottom: 0, left: 0 },
        frame: { x: 0, y: 0, width: 390, height: 844 },
      },
    }

    const styles = splitTailwindStyles(View, {
      className: `pt-${safeAreaVariableNames.top}`,
    })
    globalState.__tamagui_safe_area__ = previousState

    expect(styleOf(styles).paddingTop).toBe(31)
    expect(styles.usesSafeArea).toBe(true)
  })

  test('a whole-class utility applies as an ordinary prop', () => {
    const styles = splitTailwindStyles(View, { className: 'flex-row' })

    expect(styleOf(styles).flexDirection).toBe('row')
  })

  test('size-10 sets numeric width and height', () => {
    const styles = splitTailwindStyles(View, { className: 'size-10' })
    const expected = getConfig().tokensParsed.size['10'].val

    expect(styleOf(styles).width).toBe(expected)
    expect(styleOf(styles).height).toBe(expected)
  })

  test('inset-x-0 pins left and right', () => {
    const styles = splitTailwindStyles(View, { className: 'inset-x-0' })

    expect(styleOf(styles).left).toBe(0)
    expect(styleOf(styles).right).toBe(0)
    expect(styleOf(styles).top).toBeUndefined()
  })

  test('logical spacing and gap axes resolve to native styles', () => {
    const styles = splitTailwindStyles(View, {
      className: 'ps-4 pe-2 pbs-4 pbe-2 -ms-1 me-4 -mbs-1 mbe-4 gap-x-2 gap-y-4',
    })
    const space = getConfig().tokensParsed.space

    expect(styleOf(styles)).toMatchObject({
      paddingStart: space['4'].val,
      paddingEnd: space['2'].val,
      paddingTop: space['4'].val,
      paddingBottom: space['2'].val,
      marginStart: -space['1'].val,
      marginEnd: space['4'].val,
      marginTop: -space['1'].val,
      marginBottom: space['4'].val,
      columnGap: space['2'].val,
      rowGap: space['4'].val,
    })
  })

  test('logical border sides resolve to native styles', () => {
    const styles = splitTailwindStyles(View, {
      className: 'border-s-2 border-e-white border-bs-2 border-be-white',
    })

    expect(styleOf(styles)).toMatchObject({
      borderStartWidth: getConfig().tokensParsed.space['2'].val,
      borderEndColor: '#fff',
      borderTopWidth: getConfig().tokensParsed.space['2'].val,
      borderBottomColor: '#fff',
    })
  })

  test('logical radii and standard flex and aspect conveniences resolve natively', () => {
    const styles = splitTailwindStyles(View, {
      className: 'rounded-s-4 rounded-se-8 grow shrink-0 aspect-video',
    })

    expect(styleOf(styles)).toMatchObject({
      borderStartStartRadius: getConfig().tokensParsed.radius['4'].val,
      borderEndStartRadius: getConfig().tokensParsed.radius['4'].val,
      borderStartEndRadius: getConfig().tokensParsed.radius['8'].val,
      flexGrow: 1,
      flexShrink: 0,
      aspectRatio: 16 / 9,
    })
  })

  test('text-white sets color on Text', () => {
    const styles = splitTailwindStyles(Text, { className: 'text-white' })

    expect(styleOf(styles).color).toBe('#fff')
    expect(styleOf(styles).textAlign).toBeUndefined()
  })
})

// same rule as web: a restated shorthand applies at its authored position, so a
// longhand written between the two occurrences does not survive it
describe('authored ordering across shorthand and longhand candidates', () => {
  const space = (name: string) => getConfig().tokensParsed.space[name].val

  test('a restated shorthand overrides an earlier horizontal longhand', () => {
    const styles = splitTailwindStyles(View, { className: 'p-4 px-2 p-6' })

    expect(styleOf(styles).paddingLeft).toBe(space('6'))
  })

  test('a restated longhand overrides a later shorthand', () => {
    const styles = splitTailwindStyles(View, { className: 'pt-2 p-4 pt-8' })

    expect(styleOf(styles).paddingTop).toBe(space('8'))
  })

  test('margin follows the same rule', () => {
    const styles = splitTailwindStyles(View, { className: 'm-4 mx-2 m-6' })

    expect(styleOf(styles).marginLeft).toBe(space('6'))
  })

  test('radius corners follow the same rule', () => {
    const styles = splitTailwindStyles(View, {
      className: 'rounded-[4px] rounded-t-[2px] rounded-[6px]',
    })

    expect(styleOf(styles).borderTopLeftRadius).toBe(6)
  })

  test('border sides follow the same rule', () => {
    const styles = splitTailwindStyles(View, {
      className: 'border-[4px] border-x-[2px] border-[6px]',
    })

    expect(styleOf(styles).borderLeftWidth).toBe(6)
  })

  test('a later padding shorthand resets an earlier logical longhand', () => {
    const styles = splitTailwindStyles(View, { className: 'ps-2 p-4' })

    expect(styleOf(styles).paddingStart).toBeUndefined()
    expect(styleOf(styles).paddingLeft).toBe(space('4'))
  })

  test('a later logical longhand still overrides the matching edge of a shorthand', () => {
    const styles = splitTailwindStyles(View, { className: 'p-4 ps-2' })

    expect(styleOf(styles).paddingStart).toBe(space('2'))
    expect(styleOf(styles).paddingLeft).toBe(space('4'))
    expect(styleOf(styles).paddingTop).toBe(space('4'))
  })

  test('a later gap shorthand resets an earlier axis longhand', () => {
    const styles = splitTailwindStyles(View, { className: 'gap-x-2 gap-4' })

    expect(styleOf(styles).columnGap).toBeUndefined()
    expect(styleOf(styles).gap).toBe(space('4'))
  })

  test('a later radius shorthand resets earlier logical corners', () => {
    const styles = splitTailwindStyles(View, {
      className: 'rounded-s-4 rounded-[6px]',
    })

    expect(styleOf(styles).borderStartStartRadius).toBeUndefined()
    expect(styleOf(styles).borderEndStartRadius).toBeUndefined()
    expect(styleOf(styles).borderTopLeftRadius).toBe(6)
  })

  test('a later border-width shorthand resets an earlier logical side', () => {
    const styles = splitTailwindStyles(View, {
      className: 'border-s-2 border-[6px]',
    })

    expect(styleOf(styles).borderStartWidth).toBeUndefined()
    expect(styleOf(styles).borderLeftWidth).toBe(6)
  })
})

describe('web-only candidates', () => {
  test('an unclaimed class is dropped instead of leaking into native className', () => {
    expect(getTailwindClassPlan('grid-cols-3', getConfig())).toBeNull()
    expect(
      splitTailwindStyles(View, { className: 'grid-cols-3' }).viewProps.className
    ).toBeUndefined()
  })

  test.each([
    'grid',
    'overflow-x-hidden',
    'overflow-y-scroll',
    'truncate',
    'text-clip',
    'object-cover',
    'w-screen',
    'h-fit',
    'block',
    'inline-flex',
    'fixed',
    'sticky',
    'overflow-auto',
  ])('%s is explicitly gated instead of silently no-oping', (candidate) => {
    expect(getTailwindClassPlan(candidate, getConfig())).toBeNull()
    expect(
      splitTailwindStyles(View, { className: candidate }).viewProps.className
    ).toBeUndefined()
  })

  test('dropping a web-only candidate warns once, naming the class', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const nodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    try {
      splitTailwindStyles(View, { className: 'float-right' })
      splitTailwindStyles(View, { className: 'float-right' })
    } finally {
      process.env.NODE_ENV = nodeEnv
    }

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('float-right')
  })
})

describe('conditions evaluate on native', () => {
  test('a hover clause only applies while hovered', () => {
    const base = splitTailwindStyles(View, {
      className: 'bg-[red] hover:bg-[blue]',
    })
    const hovered = splitTailwindStyles(
      View,
      { className: 'bg-[red] hover:bg-[blue]' },
      { componentState: { hover: true } }
    )

    expect(styleOf(base).backgroundColor).toBe('red')
    expect(styleOf(hovered).backgroundColor).toBe('blue')
  })
})

describe('class-first styled()', () => {
  test('base and variant class strings normalize with modifiers', () => {
    const Frame = styled(
      View,
      'p-4 rounded-4 hover:bg-[red] sm:m-4 enter:opacity-0 base-user',
      {
        variants: {
          size: {
            sm: 'h-8 px-3 hover:opacity-50 sm:mt-4 enter:scale-95 simple-user',
          },
        } as const,
      }
    )
    const resolved = tailwindStyleFrontend.normalizeStaticConfig!(
      Frame.staticConfig,
      getConfig()
    )

    expect(resolved.baseStyle).toMatchObject({
      padding: '4',
      borderRadius: '4',
    })
    expect(resolved.baseStyle).toMatchObject({
      backgroundColor: { hover: 'red' },
      margin: { sm: '4' },
      opacity: { enter: '0' },
    })
    expect(resolved.passthroughClassName).toBeUndefined()
    expect(resolved.variants?.size?.sm).toMatchObject({
      height: '8',
      paddingHorizontal: '3',
    })
    expect(resolved.variants?.size?.sm).toMatchObject({
      opacity: { hover: '0.5' },
      marginTop: { sm: '4' },
      scale: { enter: '0.95' },
    })
    expect(resolved.variants?.size?.sm).not.toHaveProperty('className')

    const result = splitTailwindStyles(Frame, { size: 'sm' })
    expect(styleOf(result).paddingTop).toBe(18)
    expect(styleOf(result).height).toBe(84)
  })
})

describe('frontend isolation', () => {
  test('the tailwind View is its own component carrying the descriptor', () => {
    expect(CoreView).not.toBe(View)
    expect(View.staticConfig.styleFrontend).toBe(tailwindStyleFrontend)
  })
})
