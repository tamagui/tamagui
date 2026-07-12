import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import {
  View,
  createTamagui,
  StyleObjectProperty,
  StyleObjectValue,
  StyleObjectPseudo,
} from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// enter:/exit: colon-modifiers map to enterStyle/exitStyle via the same machinery as
// hover:/active:. also covers translate-x/translate-y two-segment transforms.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function rules(props: any) {
  const styles = simplifiedGetSplitStyles(View, props)
  return (Object.values(styles.rulesToInsert || {}) as any[]).map(
    (r) =>
      `${r[StyleObjectProperty]}=${JSON.stringify(r[StyleObjectValue])}:${r[StyleObjectPseudo] || ''}`
  )
}

describe('styleMode enter/exit modifiers', () => {
  test('enter:opacity-0 sets opacity under the enter pseudo', () => {
    const styles = simplifiedGetSplitStyles(View, { className: 'enter:opacity-0' } as any)
    const list = Object.values(styles.rulesToInsert || {}) as any[]
    const enterRule = list.find((r) => r[StyleObjectPseudo] === 'enter')
    expect(enterRule).toBeTruthy()
    expect(enterRule[StyleObjectProperty]).toBe('opacity')
    expect(enterRule[StyleObjectValue]).toBe(0)
  })

  test('enter:opacity-0 class ≡ enterStyle={{opacity:0}} prop', () => {
    expect(rules({ className: 'enter:opacity-0' })).toEqual(
      rules({ enterStyle: { opacity: 0 } })
    )
  })

  test('exit:opacity-0 class ≡ exitStyle={{opacity:0}} prop', () => {
    expect(rules({ className: 'exit:opacity-0' })).toEqual(
      rules({ exitStyle: { opacity: 0 } })
    )
  })

  test('enter:scale-[0.95] → transform scale under enter', () => {
    const list = Object.values(
      simplifiedGetSplitStyles(View, { className: 'enter:scale-[0.95]' } as any)
        .rulesToInsert || {}
    ) as any[]
    const enterRule = list.find((r) => r[StyleObjectPseudo] === 'enter')
    expect(enterRule[StyleObjectValue]).toContain('scale(0.95)')
  })

  test('translate-y-[10px] / translate-x-[4px] resolve to transforms', () => {
    expect(
      findRule(
        simplifiedGetSplitStyles(View, { className: 'translate-y-[10px]' } as any)
          .rulesToInsert,
        'transform'
      )[StyleObjectValue]
    ).toBe('translateY(10px)')
    expect(
      findRule(
        simplifiedGetSplitStyles(View, { className: 'translate-x-[4px]' } as any)
          .rulesToInsert,
        'transform'
      )[StyleObjectValue]
    ).toBe('translateX(4px)')
  })

  test('enter:translate-y-[10px] class ≡ enterStyle={{y:10}} prop', () => {
    expect(rules({ className: 'enter:translate-y-[10px]' })).toEqual(
      rules({ enterStyle: { y: 10 } })
    )
  })
})
