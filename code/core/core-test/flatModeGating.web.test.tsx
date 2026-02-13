import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, StyleObjectProperty, StyleObjectValue } from '../web/src'
import { StyleObjectPseudo, StyleObjectIdentifier } from '@tamagui/helpers'
import { simplifiedGetSplitStyles } from './utils'

// helper to find a rule by property name in rulesToInsert
// optionally filter by pseudo state (undefined = base style)
function findRule(rulesToInsert: any, prop: string, pseudo?: string) {
  for (const rule of Object.values(rulesToInsert || {})) {
    const r = rule as any
    if (r[StyleObjectProperty] === prop) {
      // if pseudo is specified, match it; if undefined, match base styles (no pseudo)
      if (pseudo === undefined) {
        // for base styles, ensure no pseudo and no media prefix in identifier
        if (
          r[StyleObjectPseudo] === undefined &&
          !r[StyleObjectIdentifier]?.includes('_sm') &&
          !r[StyleObjectIdentifier]?.includes('_md')
        ) {
          return r
        }
      } else if (r[StyleObjectPseudo] === pseudo) {
        return r
      }
    }
  }
  return null
}

// test that flat mode is properly gated by styleMode setting

describe('flat mode gating - styleMode not set (default)', () => {
  beforeAll(() => {
    // use default config WITHOUT styleMode: 'flat'
    createTamagui(config.getDefaultTamaguiConfig())
  })

  test('$bg prop is passed through as-is, not transformed', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'red',
    } as any)

    // without flat mode, $bg should NOT be transformed to backgroundColor
    // it should be passed through to viewProps or ignored
    expect(styles.classNames.backgroundColor).toBeUndefined()
  })

  test('$hover:bg prop is passed through, not transformed to hoverStyle', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': 'blue',
    } as any)

    // without flat mode, $hover:bg should NOT create hover styles
    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    expect(hoverKeys.length).toBe(0)
  })

  test('$sm:bg prop is passed through, not transformed to $sm object', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:bg': 'red',
    } as any)

    // without flat mode, $sm:bg should NOT create media styles
    // (the $sm key with colon should be ignored as it's not a valid media prop)
    const smKeys = Object.keys(styles.classNames).filter(
      (k) => k.includes('sm') && k.includes('bg')
    )
    expect(smKeys.length).toBe(0)
  })

  test('regular object syntax still works', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundColor: 'red',
      hoverStyle: { backgroundColor: 'blue' },
      $sm: { backgroundColor: 'gray' },
    } as any)

    // on web, base styles go to classNames/rulesToInsert, not inline style
    expect(styles.classNames.backgroundColor).toMatch(/_bg-/)
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('red')

    // pseudo and media styles go to classNames
    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    expect(hoverKeys.length).toBeGreaterThan(0)

    const smKeys = Object.keys(styles.classNames).filter((k) => k.includes('sm'))
    expect(smKeys.length).toBeGreaterThan(0)
  })
})

describe('flat mode gating - styleMode: "tamagui" (explicit default)', () => {
  beforeAll(() => {
    const defaultConfig = config.getDefaultTamaguiConfig()
    createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        styleMode: 'tamagui', // explicitly set to tamagui mode
      },
    })
  })

  test('$bg prop is not transformed when styleMode is tamagui', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'red',
    } as any)

    // should NOT be transformed
    expect(styles.classNames.backgroundColor).toBeUndefined()
  })
})
