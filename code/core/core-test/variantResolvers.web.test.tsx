import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { StyleObjectProperty, StyleObjectValue } from '../web/src'
import {
  createFont,
  createTamagui,
  createVariable,
  createVariantResolver,
  styled,
  View,
} from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

function findRuleValue(rulesToInsert: Record<string, any>, property: string): any {
  for (const rule of Object.values(rulesToInsert)) {
    if (rule[StyleObjectProperty] === property) {
      return rule[StyleObjectValue]
    }
  }
}

function getOpacity(component: any, value: any, theme?: any) {
  const out = simplifiedGetSplitStyles(
    component,
    {
      kind: value,
    },
    theme ? { theme, themeName: 'light' } : undefined
  )
  return out.style?.opacity ?? findRuleValue(out.rulesToInsert, 'opacity')
}

let lightTheme: any

function configure(settings: Record<string, any> = {}) {
  const next = config.getDefaultTamaguiConfig()
  next.fonts.body = createFont({
    family: 'System',
    size: {
      1: 15,
      4: 18,
    },
    lineHeight: {
      1: 15,
      4: 22,
    },
    letterSpacing: {
      1: 0,
    },
    transform: {
      upper: 'uppercase',
    },
    style: {
      italic: 'italic',
    },
    weight: {
      1: '400',
    },
    color: {
      1: '$color',
    },
  })
  next.settings = {
    ...next.settings,
    ...settings,
  }
  const conf = createTamagui(next)
  lightTheme = conf.themes.light
  return conf
}

beforeAll(() => {
  configure()
})

describe('TS-style variant resolvers', () => {
  const cases = [
    ['Size', '$4'],
    ['Space', '$4'],
    ['Color', '$white'],
    ['Radius', '$4'],
    ['ZIndex', '$1'],
    ['Theme', '$color', () => lightTheme],
    ['FontSize', '$1'],
    ['FontStyle', '$italic'],
    ['FontTransform', '$upper'],
    ['FontLineHeight', '$4'],
    ['FontLetterSpacing', '$1'],
    ['number', 12],
    ['string', 'plain'],
    ['boolean', true],
    ['any', { custom: true }],
  ] as const

  test.each(cases)('%s resolver matches', (resolverKey, value, getTheme) => {
    const Comp = styled(View, {
      variants: {
        kind: {
          [resolverKey]: createVariantResolver(resolverKey, () => ({
            opacity: 0.42,
          })),
        },
      } as const,
    })

    expect(getOpacity(Comp, value, getTheme?.())).toBe(0.42)
  })

  test('exact keys win before union resolvers', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          $4: {
            opacity: 0.2,
          },
          Size: createVariantResolver('Size', () => ({
            opacity: 0.8,
          })),
        },
      } as const,
    })

    expect(getOpacity(Comp, '$4')).toBe(0.2)
  })

  test('exact true, false, and null keys win before resolvers', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          true: {
            opacity: 0.11,
          },
          false: {
            opacity: 0.12,
          },
          null: {
            opacity: 0.13,
          },
          any: createVariantResolver('any', () => ({
            opacity: 0.9,
          })),
        },
      } as const,
    })

    expect(getOpacity(Comp, true)).toBe(0.11)
    expect(getOpacity(Comp, false)).toBe(0.12)
    expect(getOpacity(Comp, null)).toBe(0.13)
  })

  test('union resolvers match in declaration order', () => {
    const StringFirst = styled(View, {
      variants: {
        kind: {
          string: createVariantResolver('string', () => ({
            opacity: 0.3,
          })),
          'Size | string': createVariantResolver('Size | string', () => ({
            opacity: 0.7,
          })),
        },
      } as const,
    })

    const SizeFirst = styled(View, {
      variants: {
        kind: {
          'Size | string': createVariantResolver('Size | string', () => ({
            opacity: 0.7,
          })),
          string: createVariantResolver('string', () => ({
            opacity: 0.3,
          })),
        },
      } as const,
    })

    expect(getOpacity(StringFirst, '$4')).toBe(0.3)
    expect(getOpacity(SizeFirst, '$4')).toBe(0.7)
  })

  test('primitive resolvers distinguish boolean, number, and string before any', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          number: createVariantResolver('number', () => ({
            opacity: 0.1,
          })),
          string: createVariantResolver('string', () => ({
            opacity: 0.2,
          })),
          boolean: createVariantResolver('boolean', () => ({
            opacity: 0.3,
          })),
          any: createVariantResolver('any', () => ({
            opacity: 0.4,
          })),
        },
      } as const,
    })

    expect(getOpacity(Comp, 1)).toBe(0.1)
    expect(getOpacity(Comp, '1')).toBe(0.2)
    expect(getOpacity(Comp, true)).toBe(0.3)
    expect(getOpacity(Comp, null)).toBe(0.4)
    expect(getOpacity(Comp, undefined)).toBeUndefined()
    expect(getOpacity(Comp, { other: true })).toBe(0.4)
  })

  test('boolean and Size resolver overlap follows declaration order for true', () => {
    let sizeFirstSeen: unknown
    const BooleanFirst = styled(View, {
      variants: {
        kind: {
          boolean: createVariantResolver('boolean', () => ({
            opacity: 0.31,
          })),
          Size: createVariantResolver('Size', (value) => ({
            opacity: value === '$4' ? 0.41 : 0.91,
          })),
        },
      } as const,
    })

    const SizeFirst = styled(View, {
      variants: {
        kind: {
          Size: createVariantResolver('Size', (value) => {
            sizeFirstSeen = value
            return {
              opacity: value === '$4' ? 0.41 : 0.91,
            }
          }),
          boolean: createVariantResolver('boolean', () => ({
            opacity: 0.31,
          })),
        },
      } as const,
    })

    expect(getOpacity(BooleanFirst, true)).toBe(0.31)
    expect(getOpacity(SizeFirst, true)).toBe(0.41)
    expect(sizeFirstSeen).toBe('$4')
  })

  test('overlapping resolver domains follow declaration order', () => {
    const ColorFirst = styled(View, {
      variants: {
        kind: {
          Color: createVariantResolver('Color', () => ({
            opacity: 0.21,
          })),
          string: createVariantResolver('string', () => ({
            opacity: 0.22,
          })),
        },
      } as const,
    })
    const StringFirst = styled(View, {
      variants: {
        kind: {
          string: createVariantResolver('string', () => ({
            opacity: 0.22,
          })),
          Color: createVariantResolver('Color', () => ({
            opacity: 0.21,
          })),
        },
      } as const,
    })
    const SizeFirst = styled(View, {
      variants: {
        kind: {
          Size: createVariantResolver('Size', () => ({
            opacity: 0.23,
          })),
          Space: createVariantResolver('Space', () => ({
            opacity: 0.24,
          })),
        },
      } as const,
    })
    const SpaceFirst = styled(View, {
      variants: {
        kind: {
          Space: createVariantResolver('Space', () => ({
            opacity: 0.24,
          })),
          Size: createVariantResolver('Size', () => ({
            opacity: 0.23,
          })),
        },
      } as const,
    })
    const CategoryNumberAny = styled(View, {
      variants: {
        kind: {
          ZIndex: createVariantResolver('ZIndex', () => ({
            opacity: 0.25,
          })),
          number: createVariantResolver('number', () => ({
            opacity: 0.26,
          })),
          any: createVariantResolver('any', () => ({
            opacity: 0.27,
          })),
        },
      } as const,
    })
    const NumberCategoryAny = styled(View, {
      variants: {
        kind: {
          number: createVariantResolver('number', () => ({
            opacity: 0.26,
          })),
          ZIndex: createVariantResolver('ZIndex', () => ({
            opacity: 0.25,
          })),
          any: createVariantResolver('any', () => ({
            opacity: 0.27,
          })),
        },
      } as const,
    })

    expect(getOpacity(ColorFirst, 'red')).toBe(0.21)
    expect(getOpacity(StringFirst, 'red')).toBe(0.22)
    expect(getOpacity(SizeFirst, '$4')).toBe(0.23)
    expect(getOpacity(SpaceFirst, '$4')).toBe(0.24)
    expect(getOpacity(CategoryNumberAny, 2)).toBe(0.25)
    expect(getOpacity(NumberCategoryAny, 2)).toBe(0.26)
  })

  test('union member order controls true default-token resolver argument', () => {
    let sizeFirstSeen: unknown
    let booleanFirstSeen: unknown
    const SizeFirst = styled(View, {
      variants: {
        kind: {
          'Size | boolean': createVariantResolver('Size | boolean', (value) => {
            sizeFirstSeen = value
            return {
              opacity: 0.28,
            }
          }),
        },
      } as const,
    })
    const BooleanFirst = styled(View, {
      variants: {
        kind: {
          'boolean | Size': createVariantResolver('boolean | Size', (value) => {
            booleanFirstSeen = value
            return {
              opacity: 0.29,
            }
          }),
        },
      } as const,
    })

    expect(getOpacity(SizeFirst, true)).toBe(0.28)
    expect(sizeFirstSeen).toBe('$4')
    expect(getOpacity(BooleanFirst, true)).toBe(0.29)
    expect(booleanFirstSeen).toBe(true)
  })

  test('true resolves through the matched category and exact true stays raw', () => {
    configure({
      defaultSize: '$4',
      defaultTokens: {
        space: '$1',
        radius: '$2',
        zIndex: '$1',
        fontSize: '$1',
      },
    })

    try {
      const seen: Record<string, unknown> = {}
      const Comp = styled(View, {
        variants: {
          sizeValue: {
            Size: (value) => {
              seen.size = value
              return { opacity: 0.1 }
            },
          },
          spaceValue: {
            Space: (value) => {
              seen.space = value
              return { opacity: 0.2 }
            },
          },
          radiusValue: {
            Radius: (value) => {
              seen.radius = value
              return { opacity: 0.3 }
            },
          },
          zIndexValue: {
            ZIndex: (value) => {
              seen.zIndex = value
              return { opacity: 0.4 }
            },
          },
          fontSizeValue: {
            FontSize: (value) => {
              seen.fontSize = value
              return { opacity: 0.5 }
            },
          },
          fanoutValue: {
            true: (value) => {
              seen.fanout = value
              return { opacity: 0.6 }
            },
            Size: () => ({ opacity: 0.7 }),
          },
        } as const,
      })

      simplifiedGetSplitStyles(Comp, {
        sizeValue: true,
        spaceValue: true,
        radiusValue: true,
        zIndexValue: true,
        fontSizeValue: true,
        fanoutValue: true,
      })

      expect(seen).toEqual({
        size: '$4',
        space: '$1',
        radius: '$2',
        zIndex: '$1',
        fontSize: '$1',
        fanout: true,
      })
    } finally {
      configure()
    }
  })

  test('resolver domains include non-token values from exported value types', () => {
    const cases = [
      ['Size', 24],
      ['Size', '50%'],
      ['Size', '12px'],
      ['Size', '50vw'],
      ['Size', 'calc(100% - 1rem)'],
      ['Space', 8],
      ['Space', '%'],
      ['Space', '1rem'],
      ['Space', '12px'],
      ['Color', 'red'],
      ['Color', '$white/50'],
      ['Color', '$/-1'],
      ['Color', '$white/.5'],
      ['Color', '$white/-1'],
      ['Color', '$white/+1'],
      ['Color', '$white/0x10'],
      ['Color', '$notConfigured/1e3'],
      ['Color', '$not/Configured/1E-3'],
      ['Color', '$notConfigured/50'],
      ['Radius', 6],
      ['Radius', '+.5rem'],
      ['Radius', '0.5rem'],
      ['ZIndex', 2],
      ['FontSize', 18],
      ['FontSize', '+.5rem'],
      ['FontSize', '1rem'],
      ['FontStyle', 'italic'],
      ['FontTransform', 'uppercase'],
      ['FontLineHeight', 22],
      ['FontLineHeight', '1.25rem'],
      ['FontLetterSpacing', 1],
      ['FontLetterSpacing', '0.125rem'],
    ] as const

    for (const [resolverKey, value] of cases) {
      const Comp = styled(View, {
        variants: {
          kind: {
            [resolverKey]: createVariantResolver(resolverKey, () => ({
              opacity: 0.62,
            })),
          },
        } as const,
      })

      expect(getOpacity(Comp, value)).toBe(0.62)
    }
  })

  test('resolver domains reject representative values outside exported domains', () => {
    const cases = [
      ['Color', 'not-a-color'],
      ['Color', '#fff'],
      ['Color', 'rgb(0,0,0)'],
      ['Color', 'hsl(0, 0%, 0%)'],
      ['Color', 'transparent'],
      ['FontSize', '16px'],
      ['FontSize', 'calc(1rem)'],
      ['FontSize', 'largeish'],
      ['FontStyle', 'oblique'],
      ['FontTransform', 'full-width'],
      ['FontLineHeight', 'tight'],
      ['FontLetterSpacing', 'wide'],
    ] as const

    for (const [resolverKey, value] of cases) {
      const Comp = styled(View, {
        variants: {
          kind: {
            [resolverKey]: createVariantResolver(resolverKey, () => ({
              opacity: 0.62,
            })),
          },
        } as const,
      })

      expect(getOpacity(Comp, value)).toBeUndefined()
    }
  })

  test('allowedStyleValues settings gate fallback domains', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          Size: createVariantResolver('Size', () => ({ opacity: 0.44 })),
          Space: createVariantResolver('Space', () => ({ opacity: 0.45 })),
        },
      } as const,
    })

    configure({ allowedStyleValues: 'strict' })
    expect(getOpacity(Comp, '50%')).toBeUndefined()

    configure({ allowedStyleValues: 'strict-web' })
    expect(getOpacity(Comp, '50vw')).toBe(0.44)
    expect(getOpacity(Comp, '+.5vw')).toBe(0.44)
    expect(getOpacity(Comp, '1e3vh')).toBe(0.44)
    expect(getOpacity(Comp, '0x10vw')).toBe(0.44)
    expect(getOpacity(Comp, 'calc()')).toBe(0.44)
    expect(getOpacity(Comp, 'min()')).toBe(0.44)
    expect(getOpacity(Comp, 'max()')).toBe(0.44)
    expect(getOpacity(Comp, '50%')).toBeUndefined()

    configure({ allowedStyleValues: 'somewhat-strict' })
    expect(getOpacity(Comp, '50%')).toBe(0.44)
    expect(getOpacity(Comp, '%')).toBe(0.44)
    expect(getOpacity(Comp, '50vw')).toBeUndefined()
    expect(getOpacity(Comp, '10px')).toBeUndefined()

    configure({ allowedStyleValues: 'somewhat-strict-web' })
    expect(getOpacity(Comp, '50%')).toBe(0.44)
    expect(getOpacity(Comp, '50vw')).toBe(0.44)
    expect(getOpacity(Comp, '10px')).toBeUndefined()

    configure({ allowedStyleValues: { size: 'strict', space: 'somewhat-strict' } })
    expect(getOpacity(Comp, '50%')).toBe(0.45)
    expect(getOpacity(Comp, '1rem')).toBe(0.45)

    const SizeOnly = styled(View, {
      variants: {
        kind: {
          Size: createVariantResolver('Size', () => ({ opacity: 0.44 })),
        },
      } as const,
    })
    expect(getOpacity(SizeOnly, '50%')).toBeUndefined()
    configure()
    expect(getOpacity(Comp, 'loose-value')).toBe(0.44)
    expect(getOpacity(SizeOnly, '10px')).toBe(0.44)

    const Universal = styled(View, {
      variants: {
        kind: {
          Radius: createVariantResolver('Radius', () => ({ opacity: 0.53 })),
          ZIndex: createVariantResolver('ZIndex', () => ({ opacity: 0.54 })),
        },
      } as const,
    })
    configure({ allowedStyleValues: 'strict-web' })
    expect(getOpacity(Universal, 'inherit')).toBe(0.53)
    expect(getOpacity(Universal, 'unset')).toBe(0.53)
    expect(getOpacity(Universal, 'var()')).toBe(0.53)
    expect(getOpacity(Universal, 'var(--layer)')).toBe(0.53)
    configure({ allowedStyleValues: { radius: 'strict', zIndex: 'strict-web' } })
    expect(getOpacity(Universal, 'inherit')).toBe(0.54)
    configure()
  })

  test('Radius and ZIndex preserve globally absent allowedStyleValues vs omitted categories', () => {
    const RadiusOnly = styled(View, {
      variants: {
        kind: {
          Radius: createVariantResolver('Radius', () => ({ opacity: 0.56 })),
        },
      } as const,
    })
    const ZIndexOnly = styled(View, {
      variants: {
        kind: {
          ZIndex: createVariantResolver('ZIndex', () => ({ opacity: 0.57 })),
        },
      } as const,
    })

    configure()
    expect(getOpacity(RadiusOnly, 'loose-radius')).toBe(0.56)
    expect(getOpacity(ZIndexOnly, 'loose-z')).toBe(0.57)

    configure({ allowedStyleValues: { size: 'strict' } })
    expect(getOpacity(RadiusOnly, 'loose-radius')).toBeUndefined()
    expect(getOpacity(ZIndexOnly, 'loose-z')).toBeUndefined()
    expect(getOpacity(RadiusOnly, 1)).toBe(0.56)
    expect(getOpacity(ZIndexOnly, 1)).toBe(0.57)
    configure()
  })

  test('specific tokens follow autocompleteSpecificTokens own-property setting', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          Color: createVariantResolver('Color', () => ({
            opacity: 0.46,
          })),
        },
      } as const,
    })

    configure({
      allowedStyleValues: 'strict',
      autocompleteSpecificTokens: 'except-special',
    })
    expect(getOpacity(Comp, '$radius.4')).toBeUndefined()
    configure({ allowedStyleValues: 'strict', autocompleteSpecificTokens: undefined })
    expect(getOpacity(Comp, '$radius.4')).toBeUndefined()
    configure({ allowedStyleValues: 'strict' })
    expect(getOpacity(Comp, '$radius.4')).toBe(0.46)
    configure({ allowedStyleValues: 'strict', autocompleteSpecificTokens: false })
    expect(getOpacity(Comp, '$radius.4')).toBe(0.46)
    configure({ allowedStyleValues: 'strict', autocompleteSpecificTokens: true })
    expect(getOpacity(Comp, '$radius.4')).toBe(0.46)
    configure()
  })

  test('variable values match aliases that include ThemeValueFallback', () => {
    const variable = createVariable({ key: '$custom', name: 'custom', val: 1 }, true)
    const Comp = styled(View, {
      variants: {
        kind: {
          Size: createVariantResolver('Size', () => ({ opacity: 0.47 })),
          Space: createVariantResolver('Space', () => ({ opacity: 0.48 })),
          Radius: createVariantResolver('Radius', () => ({ opacity: 0.49 })),
          ZIndex: createVariantResolver('ZIndex', () => ({ opacity: 0.5 })),
          Color: createVariantResolver('Color', () => ({ opacity: 0.51 })),
        },
      } as const,
    })

    expect(getOpacity(Comp, variable)).toBe(0.48)
    const SizeOnly = styled(View, {
      variants: {
        kind: {
          Size: createVariantResolver('Size', () => ({ opacity: 0.47 })),
        },
      } as const,
    })
    expect(getOpacity(SizeOnly, variable)).toBeUndefined()
    const SpaceFirst = styled(View, {
      variants: {
        kind: {
          Space: createVariantResolver('Space', () => ({ opacity: 0.48 })),
          Color: createVariantResolver('Color', () => ({ opacity: 0.51 })),
        },
      } as const,
    })
    expect(getOpacity(SpaceFirst, variable)).toBe(0.48)
    const RadiusFirst = styled(View, {
      variants: {
        kind: {
          Radius: createVariantResolver('Radius', () => ({ opacity: 0.49 })),
          ZIndex: createVariantResolver('ZIndex', () => ({ opacity: 0.5 })),
        },
      } as const,
    })
    expect(getOpacity(RadiusFirst, variable)).toBe(0.49)
  })

  test('compiled resolver entries are cached per variant map', () => {
    let ownKeysCount = 0
    const kind = new Proxy(
      {
        Size: createVariantResolver('Size', () => ({
          opacity: 0.52,
        })),
      },
      {
        ownKeys(target) {
          ownKeysCount++
          return Reflect.ownKeys(target)
        },
      }
    )
    const Comp = styled(View, {
      variants: {
        kind,
      } as const,
    })
    ownKeysCount = 0

    expect(getOpacity(Comp, '$4')).toBe(0.52)
    expect(getOpacity(Comp, '$4')).toBe(0.52)
    expect(ownKeysCount).toBe(1)
  })

  test('trimmed union members match', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          ' Size | number ': createVariantResolver(' Size | number ', () => ({
            opacity: 0.55,
          })),
        },
      } as const,
    })

    expect(getOpacity(Comp, '$4')).toBe(0.55)
    expect(getOpacity(Comp, 4)).toBe(0.55)
  })

  test('raw functional resolver entries are matched without createVariantResolver', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          'Size | number': (value) => ({
            opacity: value === '$4' ? 0.66 : 0.77,
          }),
        },
      } as const,
    })

    expect(getOpacity(Comp, '$4')).toBe(0.66)
    expect(getOpacity(Comp, 4)).toBe(0.77)
  })

  test('legacy-shaped keys only match as exact literals', () => {
    const legacySpreadKey = `${'.'.repeat(3)}size`
    const legacyNumberKey = `:${'number'}`
    const legacyCatchAllKey = '.'.repeat(3)
    const Comp = styled(View, {
      variants: {
        kind: {
          [legacySpreadKey]: () => ({ opacity: 0.81 }),
          [legacyNumberKey]: () => ({ opacity: 0.82 }),
          [legacyCatchAllKey]: () => ({ opacity: 0.83 }),
        },
      } as const,
    })

    expect(getOpacity(Comp, legacySpreadKey)).toBe(0.81)
    expect(getOpacity(Comp, legacyNumberKey)).toBe(0.82)
    expect(getOpacity(Comp, legacyCatchAllKey)).toBe(0.83)
    expect(getOpacity(Comp, '$4')).toBeUndefined()
    expect(getOpacity(Comp, 4)).toBeUndefined()
    expect(getOpacity(Comp, 'other')).toBeUndefined()
  })

  test('overlapping TS-style resolvers use declaration order', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          Size: () => ({
            opacity: 0.5,
          }),
          Radius: () => ({
            opacity: 0.4,
          }),
          Space: () => ({
            opacity: 0.3,
          }),
          ZIndex: () => ({
            opacity: 0.2,
          }),
        },
      } as const,
    })

    expect(getOpacity(Comp, '$4')).toBe(0.5)
  })

  test('default-size resolvers receive the default token for true', () => {
    for (const resolverKey of ['Size', 'Space', 'FontSize'] as const) {
      let seenSize: unknown
      const Comp = styled(View, {
        variants: {
          kind: {
            [resolverKey]: (value) => {
              seenSize = value
              return {
                opacity: 0.58,
              }
            },
          },
        },
      } as const)

      expect(getOpacity(Comp, true)).toBe(0.58)
      expect(seenSize).toBe('$4')
    }
  })
})
