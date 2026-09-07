import { join } from 'node:path'
import * as FS from 'fs-extra'
import type { CLIResolvedOptions } from '@tamagui/types'

export interface GeneratePromptOptions extends CLIResolvedOptions {
  output?: string
  styleValueSyntax?: 'string' | 'object' | 'both'
}

export async function generatePrompt(options: GeneratePromptOptions) {
  const { paths, output } = options

  // regenerate the config first
  const { loadTamagui } = require('@tamagui/static/loadTamagui')
  process.env.TAMAGUI_KEEP_THEMES = '1'
  await loadTamagui({
    ...options.tamaguiOptions,
    platform: 'web',
  })

  // read the generated config
  const configPath = join(paths.dotDir, 'tamagui.config.json')

  if (!FS.existsSync(configPath)) {
    throw new Error(
      `Config file not found at ${configPath}. Please run 'tamagui generate' first.`
    )
  }

  const config = await FS.readJSON(configPath)

  // resolve styleValueSyntax: options -> env -> config setting -> interactive prompt if tty / default 'both'
  const configSetting = config.tamaguiConfig?.settings?.styleValueSyntax
  const explicitChoice =
    options.styleValueSyntax ||
    (process.env.TAMAGUI_STYLE_VALUE_SYNTAX as any) ||
    configSetting
  const { resolveStyleValueSyntax } = require('./setup-prompt')
  const resolvedSyntax = await resolveStyleValueSyntax(explicitChoice)

  // generate markdown
  const markdown = generateMarkdown(config, { styleValueSyntax: resolvedSyntax })

  // write to file
  const outputPath = output || join(process.cwd(), 'tamagui-prompt.md')
  await FS.writeFile(outputPath, markdown, 'utf-8')

  console.info(`\n  ✓ Generated prompt file at ${outputPath}\n`)
}

export interface GenerateMarkdownOptions {
  styleValueSyntax?: 'string' | 'object' | 'both'
}

export function generateMarkdown(config: any, options?: GenerateMarkdownOptions): string {
  const sections: string[] = []

  // header
  sections.push('# Tamagui Configuration\n\n')
  sections.push(
    'This document provides an overview of the Tamagui configuration for this project.\n\n'
  )

  // get shorthands for use throughout the document
  const shorthands = config.tamaguiConfig?.shorthands || {}
  const reverseShorthands: Record<string, string> = {}
  for (const [short, full] of Object.entries(shorthands)) {
    reverseShorthands[full as string] = short
  }

  // helper function to get the correct property name based on settings
  const getPropName = (fullProp: string): string => {
    const settings = config.tamaguiConfig?.settings || {}
    if (settings.onlyAllowShorthands) {
      if (reverseShorthands[fullProp]) return reverseShorthands[fullProp]
      if (fullProp === 'backgroundColor' && reverseShorthands['background']) {
        return reverseShorthands['background']
      }
    }
    return fullProp
  }

  const settings = config.tamaguiConfig?.settings || {}
  const syntaxChoice = options?.styleValueSyntax || settings.styleValueSyntax || 'both'

  // configuration settings
  sections.push('## Configuration Settings\n\n')
  sections.push(
    '**IMPORTANT:** These settings affect how you write Tamagui code in this project.\n\n'
  )

  if (settings.defaultFont) {
    sections.push(`### Default Font: \`${settings.defaultFont}\`\n\n`)
    sections.push(
      `All text components will use the "${settings.defaultFont}" font family by default.\n\n`
    )
  }

  if (settings.onlyAllowShorthands !== undefined) {
    sections.push(`### Only Allow Shorthands: \`${settings.onlyAllowShorthands}\`\n\n`)
    if (settings.onlyAllowShorthands) {
      sections.push('**You MUST use shorthand properties in this project.**\n\n')
      sections.push('Full property names are not allowed. For example:\n')
      sections.push('- ✅ `<View w="10" />` (correct)\n')
      sections.push('- ❌ `<View width="10" />` (will error)\n\n')
      sections.push(
        'See the Shorthand Properties section below for all available shorthands.\n\n'
      )
    } else {
      sections.push('You can use either shorthand or full property names.\n\n')
    }
  }

  // style value syntax section
  if (syntaxChoice === 'string') {
    sections.push('### Style value syntax: `string`\n\n')
    sections.push(
      'Only the string form is allowed in this project (e.g. `bg="red hover:blue"`).\n\n'
    )
  } else if (syntaxChoice === 'object') {
    sections.push('### Style value syntax: `object`\n\n')
    sections.push(
      "Only the object form is allowed in this project (e.g. `bg={{ default: 'red', hover: 'blue' }}`).\n\n"
    )
  } else {
    sections.push('### Style value syntax\n\n')
    sections.push('Both string and object style value syntax are allowed.\n\n')
  }

  if (settings.addThemeClassName !== undefined) {
    sections.push(`### Theme Class Name: \`${settings.addThemeClassName}\`\n\n`)
    if (settings.addThemeClassName === 'html') {
      sections.push('Theme classes are applied to the root HTML element.\n\n')
    }
  }

  const platform = settings.platform || settings.defaultProps?.platform
  if (platform) {
    sections.push(`### Platform Mode: \`${platform}\`\n\n`)
    if (platform === 'web') {
      sections.push('This project is configured for **web only**.\n\n')
    } else if (platform === 'native') {
      sections.push('This project is configured for **React Native only**.\n\n')
    }
  }

  const configString = JSON.stringify(config.tamaguiConfig)
  if (configString.includes('semi-strict-web')) {
    sections.push('### Mode: `semi-strict-web`\n\n')
    sections.push('This configuration uses semi-strict-web mode, which:\n')
    sections.push('- Optimizes for web performance\n')
    sections.push('- May have limited React Native API support\n')
    sections.push('- Focuses on web-first development\n\n')
  }

  // flat value grammar section
  sections.push('## Flat Value Grammar\n\n')
  sections.push('Conditional style values follow this grammar:\n\n')
  sections.push('```txt\n')
  sections.push('value  := base? clause*\n')
  sections.push('clause := modifier(:modifier)*:payload\n')
  sections.push('```\n\n')
  sections.push(
    '- No `$` sigils: bare token names (`bg="background"`, not `bg="$background"`).\n'
  )
  sections.push(
    '- Kebab-case theme names: `background-hover`, `border-color`, `shadow-color`.\n'
  )
  sections.push('- Numbers are px: `p={4}` is 4px, while `p="4"` is space token 4.\n')
  sections.push(
    '- Specificity precedence: platform (`ios:` > `native:` > bare) > condition count > category (media < container < theme < group < state).\n\n'
  )

  const bgProp = getPropName('background')
  const pProp = getPropName('padding')

  if (syntaxChoice === 'string') {
    sections.push('**String form:**\n\n')
    sections.push('```tsx\n')
    sections.push(
      `<View ${bgProp}="background hover:background-hover dark:blue-500" ${pProp}="4 sm:6 max-sm:2" />\n`
    )
    sections.push('```\n\n')
  } else if (syntaxChoice === 'object') {
    sections.push('**Object form:**\n\n')
    sections.push('```tsx\n')
    sections.push(
      `<View ${bgProp}={{ default: 'background', hover: 'background-hover', dark: 'blue-500' }} ${pProp}={{ default: '4', sm: '6', 'max-sm': '2' }} />\n`
    )
    sections.push('```\n\n')
  } else {
    sections.push('Both forms are allowed:\n\n')
    sections.push('```tsx\n')
    sections.push('// string form\n')
    sections.push(
      `<View ${bgProp}="background hover:background-hover dark:blue-500" ${pProp}="4 sm:6 max-sm:2" />\n\n`
    )
    sections.push('// object form\n')
    sections.push(
      `<View ${bgProp}={{ default: 'background', hover: 'background-hover', dark: 'blue-500' }} ${pProp}={{ default: '4', sm: '6', 'max-sm': '2' }} />\n`
    )
    sections.push('```\n\n')
  }

  // shorthands
  sections.push('## Shorthand Properties\n\n')
  sections.push('These shorthand properties are available for styling:\n\n')
  const shorthandEntries = Object.entries(shorthands).sort(([a], [b]) =>
    a.localeCompare(b)
  )
  sections.push(
    shorthandEntries.map(([short, full]) => `- \`${short}\` → \`${full}\``).join('\n')
  )
  sections.push('\n\n')

  // named control sizes table
  const sizes = config.tamaguiConfig?.sizes
  if (sizes && typeof sizes === 'object') {
    sections.push('## Named Control Sizes\n\n')
    sections.push(
      'Control components (Button, Input, etc.) use named sizes (`xs`, `sm`, `md`, `lg`, `xl`). Default is `md`.\n\n'
    )
    sections.push('| Size | Configuration |\n')
    sections.push('|---|---|\n')
    for (const [sizeKey, val] of Object.entries(sizes)) {
      if (sizeKey === 'default') continue
      const valStr =
        typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)
      const isDefault = sizes.default === sizeKey ? ' (default)' : ''
      sections.push(`| \`${sizeKey}\`${isDefault} | ${valStr} |\n`)
    }
    sections.push('\n')
  }

  // themes
  sections.push('## Themes\n\n')
  const themes = config.tamaguiConfig?.themes || {}
  const themeNames = Object.keys(themes).sort()

  interface ThemeHierarchy {
    level1: Set<string>
    level2: Set<string>
    level3: Set<string>
    components: Set<string>
  }

  const hierarchy: ThemeHierarchy = {
    level1: new Set(),
    level2: new Set(),
    level3: new Set(),
    components: new Set(),
  }

  for (const themeName of themeNames) {
    const parts = themeName.split('_')
    if (parts[0] === 'light' || parts[0] === 'dark') {
      hierarchy.level1.add(parts[0])
      if (
        parts.length > 1 &&
        parts[1] &&
        !parts[1].startsWith('alt') &&
        parts[1] !== 'active'
      ) {
        if (parts[1][0] === parts[1][0].toLowerCase()) {
          hierarchy.level2.add(parts[1])
        }
      }
      for (const part of parts) {
        if (part.startsWith('alt') || part === 'active') {
          hierarchy.level3.add(part)
        }
      }
      for (const part of parts) {
        if (
          part[0] &&
          part[0] === part[0].toUpperCase() &&
          part[0] !== part[0].toLowerCase()
        ) {
          hierarchy.components.add(part)
        }
      }
    } else {
      if (parts.length === 1) {
        hierarchy.level1.add(themeName)
      }
    }
  }

  sections.push('Themes are organized hierarchically and can be combined:\n\n')

  if (hierarchy.level1.size > 0) {
    sections.push('**Level 1 (Base):**\n\n')
    sections.push(
      Array.from(hierarchy.level1)
        .sort()
        .map((name) => `- ${name}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  if (hierarchy.level2.size > 0) {
    sections.push('**Level 2 (Color Schemes):**\n\n')
    sections.push(
      Array.from(hierarchy.level2)
        .sort()
        .map((name) => `- ${name}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  if (hierarchy.level3.size > 0) {
    sections.push('**Level 3 (Variants):**\n\n')
    sections.push(
      Array.from(hierarchy.level3)
        .sort()
        .map((name) => `- ${name}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  if (hierarchy.components.size > 0) {
    sections.push('**Component Themes:**\n\n')
    sections.push(
      Array.from(hierarchy.components)
        .sort()
        .map((name) => `- ${name}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  // theme usage
  sections.push('### Theme Usage\n\n')
  sections.push(
    'Themes are combined hierarchically. For example, `light_blue_alt1_Button` combines:\n'
  )
  sections.push('- Base: `light`\n')
  sections.push('- Color: `blue`\n')
  sections.push('- Variant: `alt1`\n')
  sections.push('- Component: `Button`\n\n')

  sections.push('**Basic usage:**\n\n')
  sections.push('```tsx\n')
  sections.push('// Apply a theme to components\n')
  sections.push('export default () => (\n')
  sections.push('  <Theme name="dark">\n')
  sections.push("    <Button>I'm a dark button</Button>\n")
  sections.push('  </Theme>\n')
  sections.push(')\n\n')
  sections.push('// Themes nest and combine automatically\n')
  sections.push('export default () => (\n')
  sections.push('  <Theme name="dark">\n')
  sections.push('    <Theme name="blue">\n')
  sections.push('      <Button>Uses dark_blue theme</Button>\n')
  sections.push('    </Theme>\n')
  sections.push('  </Theme>\n')
  sections.push(')\n')
  sections.push('```\n\n')

  sections.push('**Accessing theme values:**\n\n')
  sections.push('Components access theme values by their bare names:\n\n')
  const colorProp = getPropName('color')
  if (syntaxChoice === 'string') {
    sections.push('```tsx\n')
    sections.push(
      `<View ${bgProp}="background hover:background-hover" ${colorProp}="color" />\n`
    )
    sections.push('```\n\n')
  } else if (syntaxChoice === 'object') {
    sections.push('```tsx\n')
    sections.push(
      `<View ${bgProp}={{ default: 'background', hover: 'background-hover' }} ${colorProp}={{ default: 'color' }} />\n`
    )
    sections.push('```\n\n')
  } else {
    sections.push('```tsx\n')
    sections.push('// string form\n')
    sections.push(
      `<View ${bgProp}="background hover:background-hover" ${colorProp}="color" />\n\n`
    )
    sections.push('// object form\n')
    sections.push(
      `<View ${bgProp}={{ default: 'background', hover: 'background-hover' }} ${colorProp}={{ default: 'color' }} />\n`
    )
    sections.push('```\n\n')
  }

  sections.push('**Special props:**\n\n')
  sections.push('- `theme="inverse"`: Uses the opposite light or dark sub-theme\n')
  sections.push('- `reset`: Reverts to grandparent theme\n\n')

  // tokens
  sections.push('## Tokens\n\n')
  sections.push('Tokens are design system values referenced by their bare names.\n\n')

  const tokens = config.tamaguiConfig?.tokens || {}

  // space tokens (only if present and non-empty)
  if (tokens.space && Object.keys(tokens.space).length > 0) {
    sections.push('### Space Tokens\n\n')
    const spaceTokens = Object.entries(tokens.space).sort(([a], [b]) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    })
    sections.push(
      spaceTokens
        .map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  // size tokens (only if present and non-empty)
  if (tokens.size && Object.keys(tokens.size).length > 0) {
    sections.push('### Size Tokens\n\n')
    const sizeTokens = Object.entries(tokens.size).sort(([a], [b]) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    })
    sections.push(
      sizeTokens
        .map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  // radius tokens (only if present and non-empty)
  if (tokens.radius && Object.keys(tokens.radius).length > 0) {
    sections.push('### Radius Tokens\n\n')
    const radiusTokens = Object.entries(tokens.radius).sort(([a], [b]) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    })
    sections.push(
      radiusTokens
        .map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  // zIndex tokens (only if present and non-empty)
  if (tokens.zIndex && Object.keys(tokens.zIndex).length > 0) {
    sections.push('### Z-Index Tokens\n\n')
    const zIndexTokens = Object.entries(tokens.zIndex).sort(([a], [b]) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    })
    sections.push(
      zIndexTokens
        .map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  // color tokens (only if present and non-empty; summarized if large palette set)
  let sampleColorBg = 'blue-500'
  let sampleColorText = 'color'
  if (tokens.color && Object.keys(tokens.color).length > 0) {
    sections.push('### Color Tokens\n\n')
    const colorKeys = Object.keys(tokens.color).sort()

    // detect tailwind style palette keys: <palette>-<step>
    const paletteMap = new Map<string, Set<string>>()
    const standaloneColors: Array<[string, any]> = []

    for (const key of colorKeys) {
      const match = key.match(/^([a-z]+)-(\d+)$/)
      if (match) {
        const [, palette, step] = match
        if (!paletteMap.has(palette)) {
          paletteMap.set(palette, new Set())
        }
        paletteMap.get(palette)!.add(step)
      } else {
        standaloneColors.push([key, tokens.color[key]])
      }
    }

    if (paletteMap.size >= 4) {
      // summarize palettes compactly instead of 300+ line dump
      const palettes = Array.from(paletteMap.keys()).sort().join(', ')
      sections.push(`**Tailwind Palettes (\`<name>-<50..950>\`):** ${palettes}\n\n`)
      if (standaloneColors.length > 0) {
        sections.push('**Named Colors:**\n\n')
        sections.push(
          standaloneColors
            .map(([k, v]) => `- \`${k}\`: ${formatTokenValue(v)}`)
            .join('\n')
        )
        sections.push('\n\n')
      }
      sampleColorBg = colorKeys.find((k) => k.startsWith('blue-')) || colorKeys[0]
      sampleColorText =
        colorKeys.find((k) => k.startsWith('gray-') || k.startsWith('zinc-')) ||
        colorKeys[1] ||
        'color'
    } else {
      sections.push(
        colorKeys
          .map((key) => `- \`${key}\`: ${formatTokenValue(tokens.color[key])}`)
          .join('\n')
      )
      sections.push('\n\n')
      sampleColorBg = colorKeys[0] || 'background'
      sampleColorText = colorKeys[1] || 'color'
    }
  } else {
    sampleColorBg = 'background'
    sampleColorText = 'color'
  }

  // token usage examples
  sections.push('### Token Usage\n\n')
  sections.push('Tokens can be used in component props by their bare names:\n\n')

  const paddingProp = getPropName('padding')
  const gapProp = getPropName('gap')
  const marginProp = getPropName('margin')
  const widthProp = getPropName('width')
  const heightProp = getPropName('height')
  const radiusProp = getPropName('borderRadius')

  if (syntaxChoice === 'string') {
    sections.push('```tsx\n')
    sections.push(
      `// Space tokens - for margin, padding, gap\n<View ${paddingProp}="4 sm:6" ${gapProp}="2" ${marginProp}="3" />\n\n`
    )
    sections.push(
      `// Size tokens - for width, height, dimensions\n<View ${widthProp}="10 sm:12" ${heightProp}="6" />\n\n`
    )
    sections.push(
      `// Color tokens - for colors and backgrounds\n<View ${bgProp}="${sampleColorBg} hover:${sampleColorBg}" ${colorProp}="${sampleColorText}" />\n\n`
    )
    sections.push(`// Radius tokens - for border-radius\n<View ${radiusProp}="4" />\n`)
    sections.push('```\n\n')
  } else if (syntaxChoice === 'object') {
    sections.push('```tsx\n')
    sections.push(
      `// Space tokens - for margin, padding, gap\n<View ${paddingProp}={{ default: '4', sm: '6' }} ${gapProp}="2" ${marginProp}="3" />\n\n`
    )
    sections.push(
      `// Size tokens - for width, height, dimensions\n<View ${widthProp}={{ default: '10', sm: '12' }} ${heightProp}="6" />\n\n`
    )
    sections.push(
      `// Color tokens - for colors and backgrounds\n<View ${bgProp}={{ default: '${sampleColorBg}', hover: '${sampleColorBg}' }} ${colorProp}={{ default: '${sampleColorText}' }} />\n\n`
    )
    sections.push(`// Radius tokens - for border-radius\n<View ${radiusProp}="4" />\n`)
    sections.push('```\n\n')
  } else {
    sections.push('```tsx\n')
    sections.push('// String form\n')
    sections.push(
      `<View ${paddingProp}="4 sm:6" ${widthProp}="10 sm:12" ${bgProp}="${sampleColorBg}" />\n\n`
    )
    sections.push('// Object form\n')
    sections.push(
      `<View ${paddingProp}={{ default: '4', sm: '6' }} ${widthProp}={{ default: '10', sm: '12' }} ${bgProp}={{ default: '${sampleColorBg}' }} />\n\n`
    )
    sections.push(
      `// Space and radius tokens\n<View ${gapProp}="2" ${marginProp}="3" ${heightProp}="6" ${radiusProp}="4" />\n`
    )
    sections.push('```\n\n')
  }

  // media queries
  if (config.tamaguiConfig?.media) {
    sections.push('## Media Queries\n\n')
    sections.push('Available responsive breakpoints:\n\n')

    const media = config.tamaguiConfig.media
    const mediaEntries = Object.entries(media).sort(([a], [b]) => a.localeCompare(b))

    for (const [name, query] of mediaEntries) {
      sections.push(`- **${name}**: ${formatMediaQuery(query)}\n`)
    }
    sections.push('\n')

    sections.push('### Media Query Usage\n\n')
    sections.push(
      'Media queries can be used as style props or with the `useMedia` hook:\n\n'
    )

    // pick a representative media query (prefer sm or md over height-*)
    const representative =
      mediaEntries.find(([n]) => n === 'sm' || n === 'md')?.[0] ||
      mediaEntries.find(([n]) => !n.includes('-'))?.[0] ||
      mediaEntries[0]?.[0]

    if (representative) {
      const isIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(representative)
      const mediaAccess = isIdentifier
        ? `media.${representative}`
        : `media['${representative}']`

      sections.push('```tsx\n')
      if (syntaxChoice === 'string') {
        sections.push('// As a clause in the same style value\n')
        sections.push(`<View ${widthProp}="100% ${representative}:50%" />\n\n`)
      } else if (syntaxChoice === 'object') {
        sections.push('// Using the object form\n')
        sections.push(
          `<View ${widthProp}={{ default: '100%', '${representative}': '50%' }} />\n\n`
        )
      } else {
        sections.push('// String form and object form\n')
        sections.push(`<View ${widthProp}="100% ${representative}:50%" />\n`)
        sections.push(
          `<View ${widthProp}={{ default: '100%', '${representative}': '50%' }} />\n\n`
        )
      }

      sections.push('// Using the useMedia hook\n')
      sections.push('const media = useMedia()\n')
      sections.push(`if (${mediaAccess}) {\n`)
      sections.push('  // Render for this breakpoint\n')
      sections.push('}\n')
      sections.push('```\n\n')
    }
  }

  // fonts
  if (config.tamaguiConfig?.fonts) {
    sections.push('## Fonts\n\n')
    sections.push('Available font families:\n\n')
    const fonts = config.tamaguiConfig.fonts
    const fontNames = Object.keys(fonts).sort()
    sections.push(fontNames.map((name) => `- ${name}`).join('\n'))
    sections.push('\n\n')
  }

  // animations
  if (config.tamaguiConfig?.animations) {
    sections.push('## Animations\n\n')
    sections.push('Available animation presets:\n\n')
    const animations = config.tamaguiConfig.animations
    if (animations.animations) {
      const animationNames = Object.keys(animations.animations).sort()
      sections.push(animationNames.map((name) => `- ${name}`).join('\n'))
      sections.push('\n\n')
    }
  }

  // components section: emit barrel's public import surface
  const componentsSection: string[] = []
  const componentSet = new Set<string>()

  // try loading public exports from tamagui or candidate modules
  let barrelExported = false
  const candidateModules = [
    'tamagui',
    ...(config.components || []).map((c: any) => c.moduleName),
  ]
  for (const modName of candidateModules) {
    if (!modName) continue
    try {
      const mod = require(modName)
      for (const [key, val] of Object.entries(mod)) {
        if (
          /^[A-Z]/.test(key) &&
          (typeof val === 'function' || (typeof val === 'object' && val !== null))
        ) {
          if (
            !key.endsWith('Context') &&
            !key.endsWith('Provider') &&
            key !== 'Fragment'
          ) {
            componentSet.add(key)
            barrelExported = true
          }
        }
      }
      if (barrelExported) break
    } catch {
      // fallback to config.components below
    }
  }

  if (!barrelExported && config.components) {
    for (const componentModule of config.components) {
      for (const name of Object.keys(componentModule.nameToInfo || {})) {
        componentSet.add(name)
      }
    }
  }

  // filter internal frames ending with Frame when parent or part exists
  const allComponents = Array.from(componentSet).filter((name) => {
    if (name.endsWith('Frame')) {
      const base = name.replace(/Frame$/, '')
      if (
        componentSet.has(base) ||
        name.startsWith('Popper') ||
        name.startsWith('DialogPortal') ||
        name.startsWith('SelectScrollButton')
      ) {
        return false
      }
    }
    return true
  })

  // group subcomponents
  const componentGroups = new Map<string, Set<string>>()
  const processed = new Set<string>()
  const sortedComponents = [...allComponents].sort((a, b) => a.length - b.length)

  for (const name of sortedComponents) {
    if (processed.has(name)) continue
    const children = allComponents.filter(
      (other) =>
        other !== name && other.startsWith(name) && other[name.length]?.match(/[A-Z]/)
    )
    if (children.length > 0) {
      componentGroups.set(name, new Set(children))
      processed.add(name)
      children.forEach((child) => processed.add(child))
    }
  }

  const standaloneComponents = allComponents.filter((name) => !processed.has(name))
  const allBaseComponents = [
    ...standaloneComponents,
    ...Array.from(componentGroups.keys()),
  ].sort()

  componentsSection.push('## Components\n\n')
  componentsSection.push('The following components are available:\n\n')

  for (const name of allBaseComponents) {
    componentsSection.push(`- ${name}\n`)
    if (componentGroups.has(name)) {
      const children = Array.from(componentGroups.get(name)!).sort()
      for (const child of children) {
        const suffix = child.slice(name.length)
        componentsSection.push(`  - ${name}.${suffix}\n`)
      }
    }
  }
  componentsSection.push('\n')

  sections.push(...componentsSection)
  return sections.join('')
}

function formatTokenValue(value: any): string {
  if (typeof value === 'object' && value !== null && 'val' in value) {
    return String(value.val)
  }
  return String(value)
}

function formatMediaQuery(query: any): string {
  if (typeof query !== 'object' || query === null) {
    return String(query)
  }
  const parts: string[] = []
  if (query.minWidth !== undefined) {
    parts.push(`min-width: ${query.minWidth}px (screens >= ${query.minWidth}px wide)`)
  }
  if (query.maxWidth !== undefined) {
    parts.push(`max-width: ${query.maxWidth}px (screens <= ${query.maxWidth}px wide)`)
  }
  if (query.minHeight !== undefined) {
    parts.push(`min-height: ${query.minHeight}px (screens >= ${query.minHeight}px tall)`)
  }
  if (query.maxHeight !== undefined) {
    parts.push(`max-height: ${query.maxHeight}px (screens <= ${query.maxHeight}px tall)`)
  }
  if (query.hover !== undefined) {
    parts.push(`pointer: hover (${query.hover})`)
  }
  if (query.pointer !== undefined) {
    parts.push(`pointer: ${query.pointer}`)
  }
  if (query.prefersReducedMotion !== undefined) {
    parts.push(`prefers-reduced-motion: ${query.prefersReducedMotion}`)
  }
  if (parts.length === 0) {
    return JSON.stringify(query)
  }
  return parts.join(', ')
}
