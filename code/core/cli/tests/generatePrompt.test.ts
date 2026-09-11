import { describe, expect, it } from 'vitest'
import { generateConfigMarkdown as generateMarkdown } from '@tamagui/static'
import { getSetupPrompt, resolveStyleValueSyntax } from '../src/setup-prompt'

const mockConfig = {
  tamaguiConfig: {
    settings: {
      onlyAllowShorthands: true,
      defaultFont: 'body',
    },
    shorthands: {
      bg: 'background',
      p: 'padding',
      w: 'width',
      h: 'height',
      m: 'margin',
      gap: 'gap',
      rounded: 'borderRadius',
    },
    sizes: {
      default: 'md',
      xs: { fontSize: 'xs', paddingX: '2' },
      sm: { fontSize: 'sm', paddingX: '3' },
      md: { fontSize: 'sm', paddingX: '4' },
      lg: { fontSize: 'base', paddingX: '6' },
      xl: { fontSize: 'lg', paddingX: '8' },
    },
    media: {
      sm: { minWidth: 640 },
      'max-sm': { maxWidth: 639.98 },
      'height-lg': { minHeight: 1024 },
    },
    tokens: {
      space: { '2': 8, '4': 16 },
      size: { '4': 16, '6': 24 },
      radius: { '2': 4, '4': 8 },
      zIndex: {},
      color: {
        'blue-50': '#eff6ff',
        'blue-500': '#3b82f6',
        'blue-950': '#172554',
        'red-50': '#fef2f2',
        'red-500': '#ef4444',
        'red-950': '#450a0a',
        'green-50': '#f0fdf4',
        'green-500': '#22c55e',
        'green-950': '#052e16',
        'gray-50': '#f9fafb',
        'gray-500': '#6b7280',
        'gray-950': '#030712',
      },
    },
    themes: {
      light: {},
      dark: {},
      light_blue: {},
      dark_blue: {},
    },
  },
  components: [],
}

describe('generateMarkdown', () => {
  it('emits string form only when styleValueSyntax is string', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'string' })

    expect(md).toContain('### Style value syntax: `string`')
    expect(md).toContain(
      'Only the string form is allowed in this project (e.g. `bg="red hover:blue"`).'
    )
    expect(md).toContain(
      '<View bg="background hover:background-hover dark:blue-500" p="4 sm:6 max-sm:2" />'
    )
    expect(md).not.toContain('default:')
    expect(md).not.toContain('Object form')
  })

  it('emits object form only when styleValueSyntax is object', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'object' })

    expect(md).toContain('### Style value syntax: `object`')
    expect(md).toContain(
      "Only the object form is allowed in this project (e.g. `bg={{ default: 'red', hover: 'blue' }}`)."
    )
    expect(md).toContain(
      "bg={{ default: 'background', hover: 'background-hover', dark: 'blue-500' }}"
    )
    expect(md).not.toContain('String form')
    expect(md).not.toContain('p="4 sm:6 max-sm:2"')
  })

  it('emits both forms when styleValueSyntax is undefined or both', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'both' })

    expect(md).toContain('### Style value syntax')
    expect(md).toContain('Both string and object style value syntax are allowed.')
    expect(md).toContain('// string form')
    expect(md).toContain('// object form')
    expect(md).toContain(
      '<View bg="background hover:background-hover dark:blue-500" p="4 sm:6 max-sm:2" />'
    )
    expect(md).toContain(
      "bg={{ default: 'background', hover: 'background-hover', dark: 'blue-500' }}"
    )
  })

  it('respects styleValueSyntax configured in settings', () => {
    const configWithString = {
      ...mockConfig,
      tamaguiConfig: {
        ...mockConfig.tamaguiConfig,
        settings: {
          ...mockConfig.tamaguiConfig.settings,
          styleValueSyntax: 'string' as const,
        },
      },
    }
    const md = generateMarkdown(configWithString)
    expect(md).toContain('### Style value syntax: `string`')
    expect(md).not.toContain('Object form')
  })

  it('omits empty token sections', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'string' })
    expect(md).not.toContain('### Z-Index Tokens')
    expect(md).toContain('### Space Tokens')
    expect(md).toContain('### Color Tokens')
  })

  it('emits media polarity in words and valid media hook access', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'string' })
    expect(md).toContain('min-width: 640px (screens >= 640px wide)')
    expect(md).toContain('max-width: 639.98px (screens <= 639.98px wide)')
    expect(md).toContain('if (media.sm)')
    expect(md).not.toContain('if (media.height-lg)')
  })

  it('emits named control sizes table', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'string' })
    expect(md).toContain('## Named Control Sizes')
    expect(md).toContain('| `md` (default) |')
    expect(md).toContain('| `xs` |')
  })

  it('summarizes large tailwind palette sets compactly', () => {
    const md = generateMarkdown(mockConfig, { styleValueSyntax: 'string' })
    expect(md).toContain(
      '**Tailwind Palettes (`<name>-<50..950>`):** blue, gray, green, red'
    )
  })
})

describe('setup-prompt', () => {
  it('defaults to both in non-TTY', async () => {
    const syntax = await resolveStyleValueSyntax()
    expect(syntax).toBe('both')
  })

  it('passes explicit syntax through', async () => {
    expect(await resolveStyleValueSyntax('string')).toBe('string')
    expect(await resolveStyleValueSyntax('object')).toBe('object')
  })

  it('emits shorthand props on View in setup template', () => {
    const prompt = getSetupPrompt()
    expect(prompt).toContain('<View w={200} h={200} bg="background" />')
    expect(prompt).not.toContain('<View width={200} height={200} bg="background" />')
  })
})
