import { describe, expectTypeOf, test } from 'vitest'

import {
  createThemes,
  type ThemeDefinitionContext,
  type ThemeNames,
} from '../src/createThemes'

const tokens = {
  color: {
    white: '#fff',
    black: '#000',
    red: '#f00',
  },
} as const

type LevelParent = Record<string, unknown> & { level?: number }
type LevelChildren<Depth extends number> = Depth extends 4
  ? {
      level2: LevelDefinition<3>
      level3: LevelDefinition<3>
      level4: LevelDefinition<3>
    }
  : Depth extends 3
    ? {
        level2: LevelDefinition<2>
        level3: LevelDefinition<2>
        level4: LevelDefinition<2>
      }
    : Depth extends 2
      ? {
          level2: LevelDefinition<1>
          level3: LevelDefinition<1>
          level4: LevelDefinition<1>
        }
      : Depth extends 1
        ? {
            level2: LevelDefinition<0>
            level3: LevelDefinition<0>
            level4: LevelDefinition<0>
          }
        : {}

type LevelDefinition<Depth extends number> = (
  context: ThemeDefinitionContext<LevelParent>
) => { level: number; children: LevelChildren<Depth> } | null

const levels = (): LevelChildren<4> => {
  const raise = (by: number): LevelDefinition<3> =>
    (({ parent }) => ({
      level: Math.min((parent.level ?? 1) + by, 4),
      children: levels() as LevelChildren<3>,
    })) as LevelDefinition<3>

  return { level2: raise(1), level3: raise(2), level4: raise(3) }
}

describe('createThemes types', () => {
  test('derives recursively generated names and theme keys', () => {
    const tree = {
      light: { scheme: 'light', palette: 'gray' },
      dark: { scheme: 'dark', palette: 'gray' },
      children: {
        ...levels(),
        red: { palette: 'red', children: levels() },
      },
    } as const

    type Names = ThemeNames<typeof tree>
    expectTypeOf<'light_red_level2_level2'>().toMatchTypeOf<Names>()
    expectTypeOf<'dark_level4'>().toMatchTypeOf<Names>()
    // @ts-expect-error unknown generated names stay out of the union
    const invalidName: Names = 'light_blue'
    expectTypeOf(invalidName).toEqualTypeOf<Names>()

    const themes = createThemes(tokens, tree, {
      getTheme: ({ recipe }) => ({
        background: recipe.scheme === 'light' ? 'white' : 'black',
        color: recipe.palette === 'red' ? 'red' : 'black',
      }),
    })

    expectTypeOf(themes.light_red_level2_level2.background).toEqualTypeOf<string>()
    expectTypeOf(themes.dark_level4.color).toEqualTypeOf<string>()
    // @ts-expect-error invalid names do not resolve
    themes.light_blue
    // @ts-expect-error invalid theme keys do not resolve
    themes.light.border
  })

  test('rejects invalid values and keys', () => {
    createThemes(
      tokens,
      {
        light: {
          scheme: 'light',
          values: {
            // @ts-expect-error values must resolve through tokens.color or a color literal
            background: 'missing',
          },
        },
        dark: { scheme: 'dark' },
      },
      {
        getTheme: ({ recipe }) => ({
          background: recipe.scheme === 'light' ? 'white' : 'black',
        }),
      }
    )

    createThemes(
      tokens,
      {
        light: {
          scheme: 'light',
          values: {
            // @ts-expect-error values can only override getTheme keys
            border: 'red',
          },
        },
        dark: { scheme: 'dark' },
      },
      {
        getTheme: () => ({ background: 'white' }),
      }
    )

    createThemes(
      tokens,
      { light: {}, dark: {} },
      {
        // @ts-expect-error getTheme results must resolve through tokens.color or a color literal
        getTheme: () => ({ background: 'missing' }),
      }
    )
  })
})
