import {
  v6RemovedThemeNames,
  v6ThemeNameReplacements,
} from '@tamagui/style-grammar/tooling'
import { describe, expect, test } from 'vitest'
import { tamaguiToTailwind } from '../transform'

// helper: normalize whitespace for comparison
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

describe('tamaguiToTailwind', () => {
  describe('simple props', () => {
    test('background color string', () => {
      const input = `<View backgroundColor="red" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('className="bg-[red]"')
      expect(output).toContain('<div')
    })

    test('numeric width and height', () => {
      const input = `<View width={100} height={50} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('w-[100px]')
      expect(output).toContain('h-[50px]')
    })

    test('padding and margin', () => {
      const input = `<View padding={10} margin={20} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('p-[10px]')
      expect(output).toContain('m-[20px]')
    })

    test('logical spacing, gap axes, and logical border sides', () => {
      const output = tamaguiToTailwind(
        `<View paddingInlineStart="4" paddingInlineEnd="2" paddingBlockStart="4" paddingBlockEnd="2" marginInlineStart="1" marginInlineEnd="4" marginBlockStart="1" marginBlockEnd="4" columnGap="2" rowGap="4" borderInlineStartWidth="2" borderInlineEndColor="white" borderBlockStartWidth="2" borderBlockEndColor="white" borderStartStartRadius="4" borderStartEndRadius="2" borderEndStartRadius="2" borderEndEndRadius="4" />`,
        {
          tokens: {
            space: { 1: 4, 2: 8, 4: 16 },
            color: { white: '#fff' },
            radius: { 2: 8, 4: 16 },
          },
        }
      )

      expect(output).toContain(
        'className="ps-4 pe-2 pbs-4 pbe-2 ms-1 me-4 mbs-1 mbe-4 gap-x-2 gap-y-4 border-s-2 border-e-white border-bs-2 border-be-white rounded-ss-4 rounded-se-2 rounded-es-2 rounded-ee-4"'
      )
    })

    test('numeric logical spacing and radii become arbitrary px classes', () => {
      const output = tamaguiToTailwind(
        `<View paddingInlineStart={10} paddingBlockStart={10} marginInlineStart={8} borderStartStartRadius={12} columnGap={8} />`
      )

      expect(output).toContain('ps-[10px]')
      expect(output).toContain('pbs-[10px]')
      expect(output).toContain('ms-[8px]')
      expect(output).toContain('rounded-ss-[12px]')
      expect(output).toContain('gap-x-[8px]')
    })

    test('border radius', () => {
      const input = `<View borderRadius={8} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('rounded-[8px]')
    })

    test('opacity', () => {
      const input = `<View opacity={0.5} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('opacity-50')
    })

    test('raw border widths and colors use unambiguous arbitrary values', () => {
      const output = tamaguiToTailwind(`<View borderWidth={1} borderColor="red" />`)
      expect(output).toContain('border-[1px] border-[red]')
    })

    test('a config-less bare name stays a literal arbitrary value', () => {
      const input = `<View backgroundColor="blue5" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('bg-[blue5]')
    })

    test('text color uses color-* utility, not text-* (text is textAlign in v6)', () => {
      expect(tamaguiToTailwind(`<Text color="color8" />`)).toContain('color-[color8]')
      expect(tamaguiToTailwind(`<Text color="color8/50" />`)).toContain(
        'color-[color8/50]'
      )
      expect(tamaguiToTailwind(`<Text color="red" />`)).toContain('color-[red]')
      // must not emit the text-* form for color, which would set textAlign
      expect(tamaguiToTailwind(`<Text color="color8" />`)).not.toMatch(/text-\[color8\]/)
    })

    test('unit-bearing and negative string values become arbitrary [..] classes', () => {
      expect(tamaguiToTailwind(`<View minHeight="100vh" />`)).toContain('min-h-[100vh]')
      expect(tamaguiToTailwind(`<View rotate="-8deg" />`)).toContain('rotate-[-8deg]')
      expect(tamaguiToTailwind(`<View marginTop="-4px" />`)).toContain('mt-[-4px]')
      // spaces inside brackets become underscores (a class can't contain whitespace)
      expect(tamaguiToTailwind(`<View height="calc(100% - 2px)" />`)).toContain(
        'h-[calc(100%_-_2px)]'
      )
      // config-less bare names stay literal; mapped percentages are unchanged
      expect(tamaguiToTailwind(`<View width="50%" />`)).toContain('w-1/2')
      expect(tamaguiToTailwind(`<View backgroundColor="blue5" />`)).toContain(
        'bg-[blue5]'
      )
    })

    test('numeric strings stay authored without config and configured spacing emits names', () => {
      expect(tamaguiToTailwind(`<View margin="4" />`)).toContain('margin="4"')
      expect(
        tamaguiToTailwind(`<View padding="5" gap="6" />`, {
          tokens: { space: { 5: 20, 6: 24 } },
        })
      ).toContain('p-5 gap-6')
      // numeric literals still bracket their raw px
      expect(tamaguiToTailwind(`<View marginTop={-4} />`)).toContain('mt-[-4px]')
    })

    test('configured radius and size tokens emit names', () => {
      const options = { tokens: { radius: { 8: 8 }, size: { 10: 40 } } }
      expect(tamaguiToTailwind(`<View borderRadius="8" />`, options)).toContain(
        'rounded-8'
      )
      expect(tamaguiToTailwind(`<View width="10" />`, options)).toContain('w-10')
    })

    test('enter and exit clauses become enter:/exit: classes', () => {
      const out = tamaguiToTailwind(`<View opacity="enter:0" scale="enter:0.95" />`)
      expect(out).toContain('enter:opacity-0')
      expect(out).toContain('enter:scale-[0.95]')
      expect(tamaguiToTailwind(`<View opacity="exit:0" />`)).toContain('exit:opacity-0')
    })

    test('size and animation remain component props', () => {
      expect(tamaguiToTailwind(`<Text size="5" />`, { renameComponents: false })).toBe(
        `<Text size="5" />`
      )
      expect(
        tamaguiToTailwind(`<View animation="bouncy" />`, { renameComponents: false })
      ).toBe(`<View animation="bouncy" />`)
    })

    test('configured lineHeight tokens use the token-first leading namespace', () => {
      expect(
        tamaguiToTailwind(`<Text lineHeight="8" />`, {
          fonts: { body: { lineHeight: { 8: 24 } } },
        })
      ).toContain('leading-8')
    })

    test('negative values in flat clauses are not dropped', () => {
      const out = tamaguiToTailwind(`<View opacity="hover:0.5" y="hover:-2px" />`)
      expect(out).toContain('hover:opacity-50')
      expect(out).toContain('hover:translate-y-[-2px]')
    })

    test('percentage width', () => {
      const input = `<View width="50%" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('w-1/2')
    })

    test('full width', () => {
      const input = `<View width="100%" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('w-full')
    })

    test('z-index', () => {
      const input = `<View zIndex={10} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('z-10')
    })
  })

  describe('standalone value props', () => {
    test('display flex', () => {
      const input = `<View display="flex" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('flex')
      expect(output).not.toContain('display')
    })

    test('position absolute', () => {
      const input = `<View position="absolute" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('absolute')
    })

    test('flex direction', () => {
      const input = `<View flexDirection="row" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('flex-row')
    })

    test('text align center', () => {
      const input = `<Text textAlign="center" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('text-center')
    })

    test('align items center', () => {
      const input = `<View alignItems="center" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('items-center')
    })

    test('justify content space-between', () => {
      const input = `<View justifyContent="space-between" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('justify-between')
    })

    test('text transform uppercase', () => {
      const input = `<Text textTransform="uppercase" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('uppercase')
    })

    test('font weight bold', () => {
      const input = `<Text fontWeight="700" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('font-bold')
    })
  })

  describe('shorthands', () => {
    test('bg shorthand', () => {
      const input = `<View bg="red" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('bg-[red]')
    })

    test('p shorthand', () => {
      const input = `<View p={10} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('p-[10px]')
    })

    test('rounded shorthand', () => {
      const input = `<View rounded={8} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('rounded-[8px]')
    })

    test('items shorthand', () => {
      const input = `<View items="center" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('items-center')
    })
  })

  describe('component renaming', () => {
    test('View → div', () => {
      const input = `<View backgroundColor="red" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('<div')
      expect(output).not.toContain('<View')
    })

    test('Text → span', () => {
      const input = `<Text color="blue">hello</Text>`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('<span')
      expect(output).toContain('</span>')
    })

    test('XStack → div with flex-row', () => {
      const input = `<XStack gap={8}><View /></XStack>`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('flex')
      expect(output).toContain('flex-row')
      expect(output).toContain('gap-[8px]')
    })

    test('YStack → div with flex-col', () => {
      const input = `<YStack gap={4}><View /></YStack>`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('flex')
      expect(output).toContain('flex-col')
    })

    test('preserves non-style props', () => {
      const input = `<View id="test" onPress={() => {}} backgroundColor="red" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('id="test"')
      expect(output).toContain('onPress')
      expect(output).toContain('bg-[red]')
    })
  })

  describe('state clauses', () => {
    test('hover clause', () => {
      const input = `<View backgroundColor="red hover:blue" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('bg-[red]')
      expect(output).toContain('hover:bg-[blue]')
    })

    test('press clause', () => {
      const input = `<View opacity="1 press:0.8" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('opacity-100')
      expect(output).toContain('press:opacity-80')
    })

    test('focus clause', () => {
      const input = `<View borderColor="focus:blue" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('focus:border-[blue]')
    })

    test('multiple properties can carry hover clauses', () => {
      const input = `<View backgroundColor="hover:blue" opacity="hover:0.9" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('hover:bg-[blue]')
      expect(output).toContain('hover:opacity-90')
    })
  })

  describe('media queries', () => {
    // media keys are emitted verbatim: the Tailwind frontend resolves a class
    // modifier by looking the string up directly in config.media, so the only round-trip-
    // correct modifier for `key` is `key`. the old inverting map (`md → max-md`) either
    // hit a different breakpoint or, when the mapped name wasn't a config key, was dropped.
    test('md media query keeps the md modifier (min-width in v5/v6 — Tailwind-aligned)', () => {
      const output = tamaguiToTailwind(`<View backgroundColor="md:green" />`)
      expect(output).toContain('md:bg-[green]')
      // must NOT invert to max-md (that would flip show/hide direction)
      expect(output).not.toMatch(/max-md:/)
    })

    test('responsive show/hide keeps the correct direction', () => {
      // base hidden + show at md → hidden md:flex (shows at ≥768, not inverted)
      const show = tamaguiToTailwind(`<View display="none md:flex" />`)
      expect(show).toContain('hidden')
      expect(show).toContain('md:flex')
      // base flex + hide at md → flex md:hidden (bottom tabs: visible mobile, hidden desktop)
      const hide = tamaguiToTailwind(`<View display="flex md:none" />`)
      expect(hide).toContain('md:hidden')
    })

    test('sm media query', () => {
      const output = tamaguiToTailwind(`<View backgroundColor="sm:green" />`)
      expect(output).toContain('sm:bg-[green]')
    })

    test('gtSm media query keeps the gtSm modifier', () => {
      const output = tamaguiToTailwind(`<View padding="gtSm:20px" />`)
      expect(output).toContain('gtSm:p-[20px]')
    })

    test('a custom config media key round-trips as an identity modifier', () => {
      // general pass-through: any configured media key becomes the same modifier
      const input = `<View padding="tablet:10px" />`
      const out = tamaguiToTailwind(input, {
        media: { tablet: { minWidth: 900 } },
      })
      expect(out).toContain('tablet:p-[10px]')
      // without the config media, an unknown key stays a prop (documented fallback)
      const noCfg = tamaguiToTailwind(input, { renameComponents: false })
      expect(noCfg).toBe(input)
    })
  })

  describe('config-aware token resolution (mirrors the runtime token categories)', () => {
    test('a precomputed names-only grammar view is authoritative', () => {
      const output = tamaguiToTailwind(`<View padding="4 tablet:4" width="missing" />`, {
        renameComponents: false,
        grammarConfig: {
          shorthands: { p: 'padding' },
          mediaNames: ['tablet'],
          themeNames: ['dark'],
          tokenNames: {
            space: ['4'],
            size: [],
            radius: [],
            color: [],
            fontFamily: [],
            fontSize: [],
            lineHeight: [],
            letterSpacing: [],
          },
        },
      })
      expect(output).toContain('p-4')
      expect(output).toContain('tablet:p-4')
      expect(output).toContain('w-[missing]')
    })

    test('spacing tokens use the PASSED config names, not their values', () => {
      const out = tamaguiToTailwind(`<View padding="4" />`, {
        tokens: { space: { 4: 20 } },
      })
      expect(out).toContain('p-4')
    })

    test('zIndex candidates preserve names for runtime token-or-literal resolution', () => {
      expect(tamaguiToTailwind(`<View zIndex="4" />`)).toContain('z-4')
      const custom = tamaguiToTailwind(`<View zIndex="4" />`, {
        tokens: { zIndex: { 4: 40 } },
      })
      expect(custom).toContain('z-4')
    })

    test('a tokenized borderWidth falls through to the SPACE scale (like the runtime)', () => {
      // borderWidth is not its own token category — the runtime resolves it via space
      const out = tamaguiToTailwind(`<View borderWidth="2" />`, {
        tokens: { space: { 2: 7 }, color: {} },
      })
      expect(out).toContain('border-2')
    })

    test('configured color and font tokens stay dynamic (names, never baked to px)', () => {
      const options = {
        tokens: { color: { color5: '#fff' } },
        fonts: { body: { size: { 5: 16 } } },
      }
      expect(tamaguiToTailwind(`<View backgroundColor="color5" />`, options)).toContain(
        'bg-color5'
      )
      expect(tamaguiToTailwind(`<Text fontSize="5" />`, options)).toContain('text-5')
    })

    test('missing and wrong-category names lower as literal arbitrary values', () => {
      const options = {
        renameComponents: false,
        tokens: {
          space: { spaceOnly: 12 },
          size: { sizeOnly: 24 },
          radius: { radiusOnly: 8 },
          color: { colorOnly: 'red' },
        },
      }
      const output = tamaguiToTailwind(
        `<View padding="sizeOnly" width="spaceOnly" borderRadius="colorOnly" zIndex="missing" backgroundColor="spaceOnly" />`,
        options
      )
      expect(output).toContain(
        'className="p-[sizeOnly] w-[spaceOnly] rounded-[colorOnly] z-[missing] bg-[spaceOnly]"'
      )
    })

    test('an explicit partial config treats omitted token and font domains as known-empty', () => {
      const options = {
        renameComponents: false,
        tokens: { space: { 4: 20 } },
      }
      const output = tamaguiToTailwind(
        `<Text padding="4" width="missing" borderRadius="missing" zIndex="missing" color="missing" fontFamily="body" fontSize="5" lineHeight="5" letterSpacing="5" />`,
        options
      )
      expect(output).toContain('p-4')
      expect(output).toContain(
        'w-[missing] rounded-[missing] z-[missing] color-[missing] font-[body] text-[5px] leading-[5px] tracking-[5px]'
      )
    })

    test('configured tokens win reserved conveniences and enums with the same spelling', () => {
      const options = {
        renameComponents: false,
        tokens: { size: { auto: 1 }, space: { 0: 0 } },
        fonts: {
          bold: { size: { center: 14 }, lineHeight: {}, letterSpacing: {} },
        },
      }
      const output = tamaguiToTailwind(
        `<Text width="auto" inset="0" fontFamily="bold" fontSize="center" />`,
        options
      )
      expect(output).toContain('className="w-auto inset-0 font-bold text-center"')

      expect(
        tamaguiToTailwind(`<Text fontFamily="sans" />`, {
          ...options,
          fonts: {
            ...options.fonts,
            sans: { size: {}, lineHeight: {}, letterSpacing: {} },
          },
        })
      ).toContain('font-sans')

      const rawCollision = tamaguiToTailwind(
        `<Text width="auto" textAlign="center" fontWeight="700" />`,
        options
      )
      expect(rawCollision).toContain('className="w-auto"')
      expect(rawCollision).toContain('textAlign="center"')
      expect(rawCollision).toContain('fontWeight="700"')
    })

    test('font token categories are checked independently', () => {
      const options = {
        renameComponents: false,
        fonts: {
          body: {
            size: { fontSizeOnly: 14 },
            lineHeight: { lineOnly: 20 },
            letterSpacing: { letterOnly: 1 },
          },
        },
      }
      expect(tamaguiToTailwind(`<Text fontFamily="body" />`, options)).toContain(
        'font-body'
      )
      expect(tamaguiToTailwind(`<Text fontSize="fontSizeOnly" />`, options)).toContain(
        'text-fontSizeOnly'
      )
      expect(tamaguiToTailwind(`<Text lineHeight="lineOnly" />`, options)).toContain(
        'leading-lineOnly'
      )
      expect(tamaguiToTailwind(`<Text letterSpacing="letterOnly" />`, options)).toContain(
        'tracking-letterOnly'
      )
      expect(tamaguiToTailwind(`<Text fontSize="body" />`, options)).toContain(
        'text-[body]'
      )
    })
  })

  describe('complex examples', () => {
    test('real doc example: card layout', () => {
      const input = `
<YStack
  padding={20}
  backgroundColor="background"
  borderRadius={12}
  gap={8}
  backgroundColor="background hover:background-hover"
>
  <Text fontSize={18} fontWeight="700" color="color">Title</Text>
  <Text fontSize={14} color="color8">Description</Text>
</YStack>`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('flex flex-col')
      expect(output).toContain('p-[20px]')
      expect(output).toContain('bg-[background]')
      expect(output).toContain('rounded-[12px]')
      expect(output).toContain('gap-[8px]')
      expect(output).toContain('hover:bg-[background-hover]')
      expect(output).toContain('text-[18px]')
      expect(output).toContain('font-bold')
      // text color maps to the `color-*` utility (v6 `text` is textAlign)
      expect(output).toContain('color-[color]')
    })

    test('config-less legacy theme names stay literal for the migration codemod', () => {
      for (const legacyName of Object.keys(v6ThemeNameReplacements)) {
        expect(tamaguiToTailwind(`<View backgroundColor="${legacyName}" />`)).toContain(
          `className="bg-[${legacyName}]"`
        )
        expect(
          tamaguiToTailwind(`<View backgroundColor="${legacyName}/50" />`)
        ).toContain(`className="bg-[${legacyName}/50]"`)
      }

      for (const removedName of v6RemovedThemeNames) {
        expect(tamaguiToTailwind(`<View backgroundColor="${removedName}" />`)).toContain(
          `className="bg-[${removedName}]"`
        )
      }
    })

    test('preserves non-tamagui elements', () => {
      const input = `<div style={{ color: 'red' }}><button onClick={fn}>Click</button></div>`
      const output = tamaguiToTailwind(input)
      // should be unchanged (lowercase elements)
      expect(output).toContain('<div')
      expect(output).toContain('<button')
      expect(output).toContain('style={{')
    })

    test('spread props: element left UNTOUCHED (spread makes precedence order-dependent)', () => {
      // <View {...props} bg /> and <View bg {...props} /> mean OPPOSITE precedence; unshifting a
      // generated className would flip/lose that, so a spread element is not converted at all.
      const a = tamaguiToTailwind(`<View {...props} backgroundColor="red" />`)
      expect(a).toContain('{...props}')
      expect(a).toContain('backgroundColor="red"') // retained, NOT converted
      expect(a).not.toContain('bg-red')
      expect(a).not.toContain('className')

      // both orders stay distinct (never collapse to the same output)
      const b = tamaguiToTailwind(`<View backgroundColor="red" {...props} />`)
      expect(b).not.toContain('className')
      expect(b).toContain('backgroundColor="red"')
    })
  })

  describe('edge cases', () => {
    test('non-jsx code passes through without crash', () => {
      const input = 'const x = 1 + 2'
      const output = tamaguiToTailwind(input)
      // should not crash, output may differ slightly in formatting
      expect(output).toContain('const x')
    })

    test('empty component', () => {
      const input = `<View />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('<div')
    })

    test('boolean prop (no value)', () => {
      const input = `<View focusable />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('focusable')
    })

    test('renameComponents: false preserves tag names', () => {
      const input = `<View backgroundColor="red" />`
      const output = tamaguiToTailwind(input, { renameComponents: false })
      expect(output).toContain('<View')
    })
  })
})
