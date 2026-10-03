export interface GenerateConfigMarkdownOptions {
  styleValueSyntax?: 'string' | 'object' | 'both'
}

export function generateConfigMarkdown(
  config: any,
  options?: GenerateConfigMarkdownOptions
): string {
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

  if (settings.allowedStyleValues) {
    sections.push('### Allowed Style Values\n\n')
    sections.push(
      `Type validation: \`${JSON.stringify(settings.allowedStyleValues)}\`.\n\n`
    )
    sections.push(
      'Single-token values are type-checked. Run `tamagui check --strict` to also validate conditional payloads.\n\n'
    )
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
      `Control components (Button, Input, etc.) use the configured names below. Default is \`${sizes.default ?? 'md'}\`.\n\n`
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

  sections.push(themeNames.map((name) => `- \`${name}\``).join('\n'))
  sections.push(
    '\n\nTheme names above are exact configured names. Nested themes resolve relative to their parent. Use an explicit theme boundary in a component skin.\n\n'
  )
  if (themeNames.length) {
    sections.push('### Theme Usage\n\n')
    sections.push(
      `\`\`\`tsx\n<Theme name=${JSON.stringify(themeNames[0])}>\n  <Button>Uses this theme</Button>\n</Theme>\n\`\`\`\n\n`
    )
  }

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
  const sampleRadius = tokens.radius?.md
    ? 'md'
    : Object.keys(tokens.radius || {})[0] || '0px'

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
    sections.push(
      `// Radius tokens - for border-radius\n<View ${radiusProp}="${sampleRadius}" />\n`
    )
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
    sections.push(
      `// Radius tokens - for border-radius\n<View ${radiusProp}="${sampleRadius}" />\n`
    )
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
      `// Space and radius tokens\n<View ${gapProp}="2" ${marginProp}="3" ${heightProp}="6" ${radiusProp}="${sampleRadius}" />\n`
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

  componentsSection.push('## Components\n\n')
  componentsSection.push('Available named exports (import these names directly):\n\n')
  for (const name of allComponents.sort()) {
    componentsSection.push(`- ${name}\n`)
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
