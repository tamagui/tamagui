// `tamagui icons add`: writes one themed react-native-svg component per icon,
// plus an index of every component in the output dir. sources are pinned
// upstream releases fetched from unpkg, or a local dir of svg files.

import { existsSync, statSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import chalk from 'chalk'

// pinned so a cli release only changes output when these move
export const LUCIDE_VERSION = '1.49.0'
export const HEROICONS_VERSION = '2.2.0'
export const PHOSPHOR_VERSION = '2.1.1'

const libraries = ['lucide', 'heroicons', 'phosphor'] as const
type Library = (typeof libraries)[number]

const phosphorWeights = ['regular', 'bold', 'duotone', 'fill', 'light', 'thin']
// heroicons ships outline only at 24px; solid at 24px, mini at 20px, micro at 16px
const heroiconsDirs: Record<string, string> = {
  outline: '24/outline',
  solid: '24/solid',
  mini: '20/solid',
  micro: '16/solid',
}

export type AddIconsOptions = {
  names: string[]
  // a library name, or a dir holding <kebab-name>.svg files
  from?: string
  weight?: string
  variant?: string
  out?: string
  cwd?: string
}

export async function addIcons(options: AddIconsOptions) {
  const cwd = options.cwd ?? process.cwd()
  const from = options.from ?? 'lucide'
  const outDir = path.resolve(cwd, options.out ?? 'components/icons')
  const localDir = libraries.includes(from as Library) ? null : path.resolve(cwd, from)

  if (localDir && !(existsSync(localDir) && statSync(localDir).isDirectory())) {
    throw new Error(
      `--from must be ${libraries.join(', ')}, or a directory of svg files (got "${from}")`
    )
  }
  if (!options.names.length) {
    throw new Error('give the icons to add, e.g. `tamagui icons add Search ChevronDown`')
  }
  if (options.weight && from !== 'phosphor') {
    throw new Error('--weight applies to phosphor only')
  }
  if (options.weight && !phosphorWeights.includes(options.weight)) {
    throw new Error(`--weight is one of ${phosphorWeights.join(', ')}`)
  }
  if (options.variant && from !== 'heroicons') {
    throw new Error('--variant applies to heroicons only')
  }
  if (options.variant && !heroiconsDirs[options.variant]) {
    throw new Error(`--variant is one of ${Object.keys(heroiconsDirs).join(', ')}`)
  }

  const icons = [...new Set(options.names)].map((name) => {
    const isKebab = /^[a-z0-9-]+$/.test(name)
    if (!isKebab && !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
      throw new Error(`icon names are PascalCase or kebab-case, got "${name}"`)
    }
    return {
      componentName: isKebab ? kebabToPascal(name) : name,
      file: isKebab ? name : pascalToKebab(stripIconSuffix(name)),
    }
  })

  const loaded = await Promise.all(
    icons.map(async (icon) => {
      if (localDir) {
        const file = path.join(localDir, `${icon.file}.svg`)
        return { ...icon, svg: existsSync(file) ? await readFile(file, 'utf-8') : null }
      }
      const url = sourceUrl(from as Library, icon.file, options)
      const response = await fetch(url)
      if (response.status === 404) return { ...icon, svg: null }
      if (!response.ok) {
        throw new Error(`fetching ${url} failed (${response.status})`)
      }
      return { ...icon, svg: await response.text() }
    })
  )

  const unknown = loaded.filter((icon) => icon.svg === null)
  if (unknown.length) {
    throw new Error(
      `unknown ${from} icon${unknown.length === 1 ? '' : 's'}: ${unknown
        .map((icon) => `${icon.componentName} (${icon.file}.svg)`)
        .join(', ')}`
    )
  }

  await mkdir(outDir, { recursive: true })
  for (const icon of loaded) {
    const file = path.join(outDir, `${icon.componentName}.tsx`)
    await writeFile(file, svgToComponent(icon.componentName, icon.svg!))
    console.info(`${chalk.green('wrote')} ${path.relative(cwd, file)}`)
  }

  // the index lists every component in the dir, so repeated adds accumulate
  const components = (await readdir(outDir))
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => file.slice(0, -'.tsx'.length))
    .sort()
  await writeFile(
    path.join(outDir, 'index.ts'),
    components.map((name) => `export { ${name} } from './${name}'`).join('\n') + '\n'
  )
  console.info(
    `${chalk.green('wrote')} ${path.relative(cwd, path.join(outDir, 'index.ts'))} (${components.length} icons)`
  )
}

function sourceUrl(library: Library, file: string, options: AddIconsOptions) {
  switch (library) {
    case 'lucide':
      return `https://unpkg.com/lucide-static@${LUCIDE_VERSION}/icons/${file}.svg`
    case 'heroicons':
      return `https://unpkg.com/heroicons@${HEROICONS_VERSION}/${heroiconsDirs[options.variant ?? 'outline']}/${file}.svg`
    case 'phosphor': {
      const weight = options.weight ?? 'regular'
      const name = weight === 'regular' ? file : `${file}-${weight}`
      return `https://unpkg.com/@phosphor-icons/core@${PHOSPHOR_VERSION}/assets/${weight}/${name}.svg`
    }
  }
}

function pascalToKebab(name: string) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase()
}

function kebabToPascal(name: string) {
  return name
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join('')
}

// one trailing Icon is dropped for the lookup only: HeartIcon finds heart
function stripIconSuffix(name: string) {
  return name.endsWith('Icon') && name.length > 4 ? name.slice(0, -4) : name
}

type SvgNode = {
  tag: string
  attrs: [name: string, value: string][]
  children: SvgNode[]
}

// upstream icon files are machine-written and shallow; this handles nesting so
// a grouped source never drops shapes
function parseSvg(svg: string): SvgNode {
  const root: SvgNode = { tag: '', attrs: [], children: [] }
  const stack = [root]
  const tagPattern = /<(\/?)([A-Za-z][A-Za-z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g
  for (const [, closing, tag, attrText, selfClose] of svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .matchAll(tagPattern)) {
    if (closing) {
      if (stack.pop()?.tag !== tag) throw new Error(`mismatched </${tag}> in svg`)
      continue
    }
    const node: SvgNode = { tag, attrs: [], children: [] }
    for (const [, name, double, single] of attrText.matchAll(
      /([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
    )) {
      node.attrs.push([name, double ?? single])
    }
    stack[stack.length - 1].children.push(node)
    if (!selfClose) stack.push(node)
  }
  const svgNode = root.children.find((node) => node.tag === 'svg')
  if (stack.length !== 1 || !svgNode)
    throw new Error('svg source has no complete <svg> root')
  return svgNode
}

const elements: Record<string, string> = {
  path: 'Path',
  circle: 'Circle',
  ellipse: 'Ellipse',
  line: 'Line',
  polyline: 'Polyline',
  polygon: 'Polygon',
  rect: 'Rect',
  g: 'G',
  defs: 'Defs',
  clipPath: 'ClipPath',
  linearGradient: 'LinearGradient',
  radialGradient: 'RadialGradient',
  stop: 'Stop',
  use: 'Use',
}

// globals a component name would shadow; oxlint/eslint flag these
const restrictedNames = ['Infinity', 'NaN', 'undefined']

export function svgToComponent(name: string, svg: string) {
  const root = parseSvg(svg)
  const used = new Set<string>()
  const ref = (element: string) => (element === name ? `_${element}` : element)

  const jsxAttr = (attrName: string, value: string) => {
    if (attrName === 'style') {
      throw new Error(`${name}: style attributes have no react-native-svg equivalent`)
    }
    const prop =
      attrName === 'xlink:href'
        ? 'href'
        : attrName.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
    return value === 'currentColor' ? `${prop}={color}` : `${prop}="${value}"`
  }
  const keepAttr = ([attrName]: [string, string]) =>
    !(
      attrName === 'xmlns' ||
      attrName.startsWith('xmlns:') ||
      attrName === 'class' ||
      attrName === 'version' ||
      attrName.startsWith('data-') ||
      attrName.startsWith('aria-')
    )

  const rootAttrs = root.attrs.filter(keepAttr)
  const viewBox = rootAttrs.find(([attrName]) => attrName === 'viewBox')?.[1]
  if (!viewBox) throw new Error(`${name}: svg source has no viewBox`)
  // native draws children with their own stroke, so a currentColor stroke on
  // the root is repeated on each child that has none
  const rootStroke = rootAttrs.some(
    ([attrName, value]) => attrName === 'stroke' && value === 'currentColor'
  )
  const strokeWidth = rootAttrs.find(([attrName]) => attrName === 'stroke-width')?.[1]

  const emit = (node: SvgNode, indent: string): string => {
    const element = elements[node.tag]
    if (!element) throw new Error(`${name}: unsupported svg element <${node.tag}>`)
    used.add(element)
    const attrs = node.attrs.filter(keepAttr).map(([n, v]) => jsxAttr(n, v))
    if (rootStroke && !node.attrs.some(([n]) => n === 'stroke') && node.tag !== 'g') {
      attrs.push('stroke={color}')
    }
    const open = `${indent}<${ref(element)}${attrs.map((attr) => ` ${attr}`).join('')}`
    if (!node.children.length) return `${open} />`
    return `${open}>\n${node.children.map((child) => emit(child, `${indent}  `)).join('\n')}\n${indent}</${ref(element)}>`
  }

  const children = root.children.map((child) => emit(child, '        '))
  if (!children.length) throw new Error(`${name}: svg source draws nothing`)

  const svgAttrs = [
    'width={size}',
    'height={size}',
    ...rootAttrs
      .filter(([attrName]) => attrName !== 'width' && attrName !== 'height')
      .map(([attrName, value]) => jsxAttr(attrName, value)),
    '{...otherProps}',
  ]
  const imports = [...used]
    .sort()
    .map((element) => (element === name ? `${element} as _${element}` : element))
  const themedOptions =
    strokeWidth && strokeWidth !== '2' ? `, { defaultStrokeWidth: ${strokeWidth} }` : ''

  // the explicit component type lets isolatedDeclarations builds emit types
  return `${restrictedNames.includes(name) ? '/* eslint-disable no-shadow-restricted-names */\n' : ''}import { memo, type JSX } from 'react'
import { Svg, ${imports.join(', ')} } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ${name}: (props: IconProps) => JSX.Element = themed(
  memo(function ${name}(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props
    return (
      <Svg
${svgAttrs.map((attr) => `        ${attr}`).join('\n')}
      >
${children.join('\n')}
      </Svg>
    )
  })${themedOptions}
)
`
}
