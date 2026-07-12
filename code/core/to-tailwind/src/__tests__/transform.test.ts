import { describe, expect, test } from 'vitest'
import { tamaguiToTailwind } from '../transform'

// helper: normalize whitespace for comparison
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

describe('tamaguiToTailwind', () => {
  describe('simple props', () => {
    test('background color string', () => {
      const input = `<View backgroundColor="red" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('className="bg-red"')
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

    test('borderWidth 1 emits bare `border`, not `border-`', () => {
      const output = tamaguiToTailwind(
        `<View borderWidth={1} borderColor="$borderColor" />`
      )
      expect(output).toContain('border border-borderColor')
      // regression: the 1px default must not leave a dangling `border-`
      expect(output).not.toMatch(/border-(?=\s|")/)
    })

    test('token reference strips $', () => {
      const input = `<View backgroundColor="$blue5" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('bg-blue5')
    })

    test('text color uses color-* utility, not text-* (text is textAlign in v6)', () => {
      expect(tamaguiToTailwind(`<Text color="$color8" />`)).toContain('color-color8')
      expect(tamaguiToTailwind(`<Text color="red" />`)).toContain('color-red')
      // must not emit the text-* form for color, which would set textAlign
      expect(tamaguiToTailwind(`<Text color="$color8" />`)).not.toMatch(/text-color8/)
    })

    test('unit-bearing and negative string values become arbitrary [..] classes', () => {
      expect(tamaguiToTailwind(`<View minHeight="100vh" />`)).toContain('min-h-[100vh]')
      expect(tamaguiToTailwind(`<View rotate="-8deg" />`)).toContain('rotate-[-8deg]')
      expect(tamaguiToTailwind(`<View marginTop="-4px" />`)).toContain('mt-[-4px]')
      // spaces inside brackets become underscores (a class can't contain whitespace)
      expect(tamaguiToTailwind(`<View height="calc(100% - 2px)" />`)).toContain(
        'h-[calc(100%_-_2px)]'
      )
      // tokens and mapped percentages are unchanged
      expect(tamaguiToTailwind(`<View width="50%" />`)).toContain('w-1/2')
      expect(tamaguiToTailwind(`<View backgroundColor="$blue5" />`)).toContain('bg-blue5')
    })

    test('spacing tokens resolve to their EXACT pixel value (not the Tailwind ×4 scale)', () => {
      // tamagui space `$4` = 18px, `$5` = 24px, `$6` = 32px — NOT 16/20/24. emitting `m-4`
      // would resolve to 16px at runtime (Tailwind ×4), silently changing the pixel value.
      // emit an arbitrary [Npx] with the real token value so it's pixel-identical to `margin="$4"`.
      expect(tamaguiToTailwind(`<View margin="$4" />`)).toContain('m-[18px]')
      expect(tamaguiToTailwind(`<View padding="$5" />`)).toContain('p-[24px]')
      expect(tamaguiToTailwind(`<View gap="$6" />`)).toContain('gap-[32px]')
      // negative tokens resolve to their exact (negative) pixel value too
      expect(tamaguiToTailwind(`<View margin="$-1" />`)).toContain('m-[-2px]')
      expect(tamaguiToTailwind(`<View marginTop="$-2" />`)).toContain('mt-[-7px]')
      expect(tamaguiToTailwind(`<View margin="$-1" />`)).not.toMatch(/m--1/)
      // numeric literals still bracket their raw px
      expect(tamaguiToTailwind(`<View marginTop={-4} />`)).toContain('mt-[-4px]')
    })

    test('radius/size tokens resolve to their exact pixel value', () => {
      // radius `$8` = 22px (not 8), size `$10` = 104px
      expect(tamaguiToTailwind(`<View borderRadius="$8" />`)).toContain('rounded-[22px]')
      expect(tamaguiToTailwind(`<View width="$10" />`)).toContain('w-[104px]')
    })

    test('enterStyle/exitStyle become enter:/exit: classes (reconstructed to props at runtime)', () => {
      const out = tamaguiToTailwind(`<View enterStyle={{ opacity: 0, scale: 0.95 }} />`)
      expect(out).toContain('enter:opacity-0')
      expect(out).toContain('enter:scale-[0.95]')
      expect(tamaguiToTailwind(`<View exitStyle={{ opacity: 0 }} />`)).toContain(
        'exit:opacity-0'
      )
    })

    test('size / animation props become size-*/animation-* classes', () => {
      expect(tamaguiToTailwind(`<Text size="$5" />`)).toContain('size-5')
      expect(tamaguiToTailwind(`<View animation="bouncy" />`)).toContain(
        'animation-bouncy'
      )
    })

    test('negative values in a style object are not dropped', () => {
      // regression: y: -10 is a UnaryExpression and used to be silently skipped
      const out = tamaguiToTailwind(`<View hoverStyle={{ opacity: 0.5, y: -2 }} />`)
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
      expect(output).toContain('bg-red')
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
      expect(output).toContain('bg-red')
    })
  })

  describe('pseudo states', () => {
    test('hoverStyle', () => {
      const input = `<View backgroundColor="red" hoverStyle={{ backgroundColor: "blue" }} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('bg-red')
      expect(output).toContain('hover:bg-blue')
    })

    test('pressStyle', () => {
      const input = `<View opacity={1} pressStyle={{ opacity: 0.8 }} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('opacity-100')
      expect(output).toContain('active:opacity-80')
    })

    test('focusStyle', () => {
      const input = `<View focusStyle={{ borderColor: "blue" }} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('focus:border-blue')
    })

    test('multiple pseudo props in hoverStyle', () => {
      const input = `<View hoverStyle={{ backgroundColor: "blue", opacity: 0.9 }} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('hover:bg-blue')
      expect(output).toContain('hover:opacity-90')
    })
  })

  describe('media queries', () => {
    // media keys are emitted VERBATIM (identity): the styleMode runtime resolves a class
    // modifier by looking the string up directly in config.media, so the only round-trip-
    // correct modifier for `$key` is `key`. the old inverting map (`$md → max-md`) either
    // hit a different breakpoint or, when the mapped name wasn't a config key, was dropped.
    test('$md media query keeps the md modifier (min-width in v5/v6 — Tailwind-aligned)', () => {
      const output = tamaguiToTailwind(`<View $md={{ backgroundColor: "green" }} />`)
      expect(output).toContain('md:bg-green')
      // must NOT invert to max-md (that would flip show/hide direction)
      expect(output).not.toMatch(/max-md:/)
    })

    test('responsive show/hide keeps the correct direction', () => {
      // base hidden + show at md → hidden md:flex (shows at ≥768, not inverted)
      const show = tamaguiToTailwind(`<View display="none" $md={{ display: "flex" }} />`)
      expect(show).toContain('hidden')
      expect(show).toContain('md:flex')
      // base flex + hide at md → flex md:hidden (bottom tabs: visible mobile, hidden desktop)
      const hide = tamaguiToTailwind(`<View display="flex" $md={{ display: "none" }} />`)
      expect(hide).toContain('md:hidden')
    })

    test('$sm media query', () => {
      const output = tamaguiToTailwind(`<View $sm={{ backgroundColor: "green" }} />`)
      expect(output).toContain('sm:bg-green')
    })

    test('$gtSm media query keeps the gtSm modifier', () => {
      const output = tamaguiToTailwind(`<View $gtSm={{ padding: 20 }} />`)
      expect(output).toContain('gtSm:p-[20px]')
    })
  })

  describe('complex examples', () => {
    test('real doc example: card layout', () => {
      const input = `
<YStack
  padding={20}
  backgroundColor="$background"
  borderRadius={12}
  gap={8}
  hoverStyle={{ backgroundColor: "$backgroundHover" }}
>
  <Text fontSize={18} fontWeight="700" color="$color">Title</Text>
  <Text fontSize={14} color="$color8">Description</Text>
</YStack>`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('flex flex-col')
      expect(output).toContain('p-[20px]')
      expect(output).toContain('bg-background')
      expect(output).toContain('rounded-[12px]')
      expect(output).toContain('gap-[8px]')
      expect(output).toContain('hover:bg-backgroundHover')
      expect(output).toContain('text-[18px]')
      expect(output).toContain('font-bold')
      // text color maps to the `color-*` utility (v6 `text` is textAlign)
      expect(output).toContain('color-color')
    })

    test('preserves non-tamagui elements', () => {
      const input = `<div style={{ color: 'red' }}><button onClick={fn}>Click</button></div>`
      const output = tamaguiToTailwind(input)
      // should be unchanged (lowercase elements)
      expect(output).toContain('<div')
      expect(output).toContain('<button')
      expect(output).toContain('style={{')
    })

    test('handles spread props', () => {
      const input = `<View {...props} backgroundColor="red" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('{...props}')
      expect(output).toContain('bg-red')
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
