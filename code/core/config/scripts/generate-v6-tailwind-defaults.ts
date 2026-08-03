import {
  OKLCH_to_OKLab,
  OKLab_to_XYZ,
  XYZ_to_lin_sRGB,
  clip,
  gam_sRGB,
  type Color,
} from '@csstools/color-helpers'
import colors from 'tailwindcss/colors'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const TAILWIND_VERSION = '4.3.0'
export const COLOR_HELPERS_VERSION = '6.1.0'

// Tailwind v4 accepts arbitrary quarter-step multipliers, but token-first Tamagui needs a
// finite configured domain. These are v4.3.0's DEFAULT_SPACING_SUGGESTIONS exactly.
export const DEFAULT_SPACING_SUGGESTIONS = [
  '0',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '44',
  '48',
  '52',
  '56',
  '60',
  '64',
  '72',
  '80',
  '96',
] as const

const FONT_SIZE_NAMES = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
] as const

const RADIUS_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const
const SKIP_COLORS = new Set(['inherit', 'current', 'transparent', 'black', 'white'])

type Scalar = number | string
type Table = Record<string, Scalar>

export type PinnedTailwindSource = {
  colorHelpersVersion: string
  colors: Record<string, unknown>
  themeCss: string
}

export type V6TailwindDefaultTables = {
  fontSize: Table
  lineHeight: Table
  radius: Table
  size: Table
  space: Table
}

function themeVariables(themeCss: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const match of themeCss.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)) {
    out[match[1]!] = match[2]!.trim()
  }
  return out
}

function requiredVariable(variables: Record<string, string>, name: string): string {
  const value = variables[name]
  if (value === undefined) {
    throw new Error(`Tailwind ${TAILWIND_VERSION} theme.css is missing --${name}`)
  }
  return value
}

function toPx(value: string, relativeTo?: number): number {
  if (value.endsWith('rem')) return Number.parseFloat(value) * 16
  if (value.endsWith('px')) return Number.parseFloat(value)
  if (/^-?\d+(?:\.\d+)?$/.test(value) && relativeTo !== undefined) {
    return Number(value) * relativeTo
  }
  const ratio = /^calc\(\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*\)$/.exec(value)
  if (ratio && relativeTo !== undefined) {
    return (Number(ratio[1]) / Number(ratio[2])) * relativeTo
  }
  throw new Error(`Unsupported Tailwind length: ${value}`)
}

export function readPinnedTailwindSource(): PinnedTailwindSource {
  const themePath = fileURLToPath(import.meta.resolve('tailwindcss/theme.css'))
  const packageRoot = dirname(themePath)
  const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
  if (packageJson.version !== TAILWIND_VERSION) {
    throw new Error(
      `Expected tailwindcss ${TAILWIND_VERSION}, resolved ${String(packageJson.version)}`
    )
  }
  const colorHelpersPackageRoot = dirname(
    dirname(fileURLToPath(import.meta.resolve('@csstools/color-helpers')))
  )
  const colorHelpersPackageJson = JSON.parse(
    readFileSync(join(colorHelpersPackageRoot, 'package.json'), 'utf8')
  )
  if (colorHelpersPackageJson.version !== COLOR_HELPERS_VERSION) {
    throw new Error(
      `Expected @csstools/color-helpers ${COLOR_HELPERS_VERSION}, resolved ${String(colorHelpersPackageJson.version)}`
    )
  }
  return {
    colorHelpersVersion: colorHelpersPackageJson.version,
    colors: colors as Record<string, unknown>,
    themeCss: readFileSync(themePath, 'utf8'),
  }
}

export function createDefaultTables(themeCss: string): V6TailwindDefaultTables {
  const variables = themeVariables(themeCss)
  const spacing = toPx(requiredVariable(variables, 'spacing'))
  const size: Table = { px: 1 }
  const space: Table = { px: 1 }

  for (const name of DEFAULT_SPACING_SUGGESTIONS) {
    const value = Number(name) * spacing
    const tokenName = name.replaceAll('.', '-')
    size[tokenName] = value
    space[tokenName] = value
  }
  space['-px'] = -1
  for (const name of DEFAULT_SPACING_SUGGESTIONS) {
    if (name !== '0') {
      const tokenName = name.replaceAll('.', '-')
      space[`-${tokenName}`] = -Number(name) * spacing
    }
  }

  // no `none`: reserved css-wide keyword names are rejected at config creation;
  // tailwind's rounded-none is a candidate-layer spelling, not a token
  const radius: Table = {}
  for (const name of RADIUS_NAMES) {
    radius[name] = toPx(requiredVariable(variables, `radius-${name}`))
  }
  radius.full = 9999

  const fontSize: Table = {}
  const lineHeight: Table = {}
  for (const name of FONT_SIZE_NAMES) {
    const sizeValue = toPx(requiredVariable(variables, `text-${name}`))
    fontSize[name] = `${sizeValue}px`
    lineHeight[name] = `${toPx(
      requiredVariable(variables, `text-${name}--line-height`),
      sizeValue
    )}px`
  }

  return { fontSize, lineHeight, radius, size, space }
}

function normalizedColorSource(source: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [name, value] of Object.entries(source)) {
    if (SKIP_COLORS.has(name)) continue
    if (value && typeof value === 'object') {
      out[name] = Object.fromEntries(
        Object.entries(value as Record<string, unknown>).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string'
        )
      )
    }
  }
  return out
}

export function sourceChecksum(source: PinnedTailwindSource): string {
  const variables = themeVariables(source.themeCss)
  const relevantVariables = Object.fromEntries([
    ['spacing', requiredVariable(variables, 'spacing')],
    ...RADIUS_NAMES.map((name) => [
      `radius-${name}`,
      requiredVariable(variables, `radius-${name}`),
    ]),
    ...FONT_SIZE_NAMES.flatMap((name) => [
      [`text-${name}`, requiredVariable(variables, `text-${name}`)],
      [
        `text-${name}--line-height`,
        requiredVariable(variables, `text-${name}--line-height`),
      ],
    ]),
  ])
  const canonical = JSON.stringify({
    tailwindVersion: TAILWIND_VERSION,
    colorHelpersVersion: source.colorHelpersVersion,
    spacingSuggestions: DEFAULT_SPACING_SUGGESTIONS,
    relevantVariables,
    colors: normalizedColorSource(source.colors),
  })
  return createHash('sha256').update(canonical).digest('hex')
}

export function convertColorsToSrgb(source: Record<string, unknown>): Table {
  // tailwind publishes these colors as OKLCH. native needs sRGB, so use the
  // pinned W3C conversion math, then clip and round each channel to 8-bit hex.
  // no `transparent`: it is a reserved CSS-wide keyword — config
  // creation rejects tokens by these names, and the value resolves
  // byte-identically through the reserved-literal path without a token
  const out: Table = {
    white: '#ffffff',
    black: '#000000',
  }

  for (const [hue, shades] of Object.entries(normalizedColorSource(source))) {
    for (const [shade, value] of Object.entries(shades as Record<string, string>)) {
      const match =
        /^oklch\(\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))%\s+([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s+([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:deg)?\s*\)$/.exec(
          value
        )
      if (!match) {
        throw new Error(`Unsupported Tailwind color: ${value}`)
      }
      const oklch: Color = [Number(match[1]) / 100, Number(match[2]), Number(match[3])]
      const srgb = clip(gam_sRGB(XYZ_to_lin_sRGB(OKLab_to_XYZ(OKLCH_to_OKLab(oklch)))))
      out[`${hue}-${shade}`] = `#${srgb
        .map((channel) =>
          Math.round(channel * 255)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')}`
    }
  }
  return out
}

function stringLiteral(value: string): string {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
}

function propertyName(name: string): string {
  return /^[$A-Z_a-z][$\w]*$/.test(name) ? name : stringLiteral(name)
}

function renderTable(name: string, table: Table, type = 'as const'): string {
  const entries = Object.entries(table)
    .map(
      ([key, value]) =>
        `  ${propertyName(key)}: ${typeof value === 'string' ? stringLiteral(value) : value},`
    )
    .join('\n')
  return `export const ${name} = {\n${entries}\n} ${type}`
}

// the colors and scales are written to separate modules so the aligned scale base can be
// imported (v6-base, v6-classic) without bundling the 289-color palette on native.
export function generateSources(): { colors: string; scales: string } {
  const source = readPinnedTailwindSource()
  const tables = createDefaultTables(source.themeCss)
  const convertedColors = convertColorsToSrgb(source.colors)
  const checksum = sourceChecksum(source)
  const header = `// AUTO-GENERATED from tailwindcss@${TAILWIND_VERSION} with @csstools/color-helpers@${COLOR_HELPERS_VERSION}. Do not edit.
// Source checksum: ${checksum}
`
  const colors = `${header}${renderTable('tailwindColors', convertedColors, 'satisfies Record<string, string>')}
`
  const scales = `${header}export const tailwindSource = {
  tailwindVersion: '${TAILWIND_VERSION}',
  colorConverter: '@csstools/color-helpers@${COLOR_HELPERS_VERSION}',
  checksum: '${checksum}',
} as const

${renderTable('tailwindSpace', tables.space)}

${renderTable('tailwindSize', tables.size)}

${renderTable('tailwindRadius', tables.radius)}

${renderTable('tailwindFontSize', tables.fontSize)}

${renderTable('tailwindLineHeight', tables.lineHeight)}
`
  return { colors, scales }
}

function main(): void {
  const srcDir = join(dirname(fileURLToPath(import.meta.url)), '../src')
  const outputs = {
    colors: join(srcDir, '../../themes/src/tailwind-colors.ts'),
    scales: join(srcDir, 'v6-tailwind-scales.generated.ts'),
  }
  const generated = generateSources()
  if (process.argv.includes('--check')) {
    for (const key of ['colors', 'scales'] as const) {
      const current = readFileSync(outputs[key], 'utf8')
      if (current !== generated[key]) {
        throw new Error(
          `v6 Tailwind ${key} drifted; run bun ./scripts/generate-v6-tailwind-defaults.ts`
        )
      }
    }
    console.info(
      'v6 Tailwind defaults match tailwindcss@4.3.0 + @csstools/color-helpers@6.1.0'
    )
    return
  }
  for (const key of ['colors', 'scales'] as const) {
    writeFileSync(outputs[key], generated[key])
    console.info(`wrote ${outputs[key]}`)
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main()
}
