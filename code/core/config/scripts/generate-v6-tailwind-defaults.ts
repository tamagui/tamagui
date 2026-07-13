import colors from 'tailwindcss/colors'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const TAILWIND_VERSION = '4.3.0'
export const PLAYWRIGHT_VERSION = '1.58.2'

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
const Z_INDEX_NAMES = ['0', '1', '2', '3', '4', '5', '10', '20', '30', '40', '50'] as const
const SKIP_COLORS = new Set(['inherit', 'current', 'transparent', 'black', 'white'])

type Scalar = number | string
type Table = Record<string, Scalar>

export type PinnedTailwindSource = {
  colors: Record<string, unknown>
  packageRoot: string
  playwrightVersion: string
  themeCss: string
}

export type V6TailwindDefaultTables = {
  fontSize: Table
  lineHeight: Table
  radius: Table
  size: Table
  space: Table
  zIndex: Table
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
  const ratio = /^calc\(\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*\)$/.exec(
    value
  )
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
  const playwrightPackagePath = fileURLToPath(import.meta.resolve('playwright/package.json'))
  const playwrightPackageJson = JSON.parse(readFileSync(playwrightPackagePath, 'utf8'))
  if (playwrightPackageJson.version !== PLAYWRIGHT_VERSION) {
    throw new Error(
      `Expected playwright ${PLAYWRIGHT_VERSION}, resolved ${String(playwrightPackageJson.version)}`
    )
  }
  return {
    colors: colors as Record<string, unknown>,
    packageRoot,
    playwrightVersion: playwrightPackageJson.version,
    themeCss: readFileSync(themePath, 'utf8'),
  }
}

export function createDefaultTables(themeCss: string): V6TailwindDefaultTables {
  const variables = themeVariables(themeCss)
  const spacing = toPx(requiredVariable(variables, 'spacing'))
  const size: Table = { $px: 1 }
  const space: Table = { $px: 1 }

  for (const name of DEFAULT_SPACING_SUGGESTIONS) {
    const value = Number(name) * spacing
    size[`$${name}`] = value
    space[`$${name}`] = value
  }
  space['-px'] = -1
  for (const name of DEFAULT_SPACING_SUGGESTIONS) {
    if (name !== '0') space[`-${name}`] = -Number(name) * spacing
  }

  const radius: Table = { $none: 0 }
  for (const name of RADIUS_NAMES) {
    radius[`$${name}`] = toPx(requiredVariable(variables, `radius-${name}`))
  }
  radius.$full = 9999

  const zIndex = Object.fromEntries(Z_INDEX_NAMES.map((name) => [`$${name}`, Number(name)]))

  const fontSize: Table = {}
  const lineHeight: Table = {}
  for (const name of FONT_SIZE_NAMES) {
    const sizeValue = toPx(requiredVariable(variables, `text-${name}`))
    fontSize[`$${name}`] = `${sizeValue}px`
    lineHeight[`$${name}`] = `${toPx(
      requiredVariable(variables, `text-${name}--line-height`),
      sizeValue
    )}px`
  }

  return { fontSize, lineHeight, radius, size, space, zIndex }
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
    playwrightVersion: source.playwrightVersion,
    spacingSuggestions: DEFAULT_SPACING_SUGGESTIONS,
    zIndexNames: Z_INDEX_NAMES,
    relevantVariables,
    colors: normalizedColorSource(source.colors),
  })
  return createHash('sha256').update(canonical).digest('hex')
}

async function convertColorsToSrgb(source: Record<string, unknown>): Promise<Table> {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.setContent('<canvas id="c" width="1" height="1"></canvas>')
    const out: Table = {
      $white: '#ffffff',
      $black: '#000000',
      $transparent: 'transparent',
    }

    for (const [hue, shades] of Object.entries(normalizedColorSource(source))) {
      for (const [shade, value] of Object.entries(shades as Record<string, string>)) {
        const hex = await page.evaluate((color) => {
          if (!CSS.supports('color', color)) return null
          const canvas = document.getElementById('c') as HTMLCanvasElement
          const context = canvas.getContext('2d')!
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = color
          context.fillRect(0, 0, 1, 1)
          const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
          return `#${[red, green, blue]
            .map((channel) => channel.toString(16).padStart(2, '0'))
            .join('')}`
        }, value)
        if (hex) out[`$${hue}-${shade}`] = hex
      }
    }
    return out
  } finally {
    await browser.close()
  }
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

export async function generateSource(): Promise<string> {
  const source = readPinnedTailwindSource()
  const tables = createDefaultTables(source.themeCss)
  const convertedColors = await convertColorsToSrgb(source.colors)
  const checksum = sourceChecksum(source)
  return `// AUTO-GENERATED from tailwindcss@${TAILWIND_VERSION} with playwright@${PLAYWRIGHT_VERSION}. Do not edit.
// Source checksum: ${checksum}
export const tailwindSource = {
  tailwindVersion: '${TAILWIND_VERSION}',
  colorConverter: 'playwright@${PLAYWRIGHT_VERSION}',
  checksum: '${checksum}',
} as const

${renderTable('tailwindColors', convertedColors, 'satisfies Record<string, string>')}

${renderTable('tailwindSpace', tables.space)}

${renderTable('tailwindSize', tables.size)}

${renderTable('tailwindRadius', tables.radius)}

${renderTable('tailwindZIndex', tables.zIndex)}

${renderTable('tailwindFontSize', tables.fontSize)}

${renderTable('tailwindLineHeight', tables.lineHeight)}
`
}

async function main(): Promise<void> {
  const outputPath = join(dirname(fileURLToPath(import.meta.url)), '../src/v6-tailwind-defaults.generated.ts')
  const generated = await generateSource()
  if (process.argv.includes('--check')) {
    const current = readFileSync(outputPath, 'utf8')
    if (current !== generated) {
      throw new Error(
        'v6 Tailwind defaults drifted; run bun ./scripts/generate-v6-tailwind-defaults.ts'
      )
    }
    console.info(
      'v6 Tailwind defaults match tailwindcss@4.3.0 + playwright@1.58.2'
    )
    return
  }
  writeFileSync(outputPath, generated)
  console.info(`wrote ${outputPath}`)
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  await main()
}
