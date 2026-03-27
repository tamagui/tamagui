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

    test('token reference strips $', () => {
      const input = `<View backgroundColor="$blue5" />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('bg-blue5')
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
    test('$sm media query', () => {
      const input = `<View $sm={{ backgroundColor: "green" }} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('max-sm:bg-green')
    })

    test('$gtSm media query (min-width)', () => {
      const input = `<View $gtSm={{ padding: 20 }} />`
      const output = tamaguiToTailwind(input)
      expect(output).toContain('sm:p-[20px]')
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
      expect(output).toContain('text-color')
    })

    test('preserves non-tamagui elements', () => {
      const input = `<div style={{ color: 'red' }}><button onClick={fn}>Click</button></div>`
      const output = tamaguiToTailwind(input)
      // should be unchanged (lowercase elements)
      expect(output).toContain('<div')
      expect(output).toContain('<button')
      expect(output).toContain("style={{")
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
