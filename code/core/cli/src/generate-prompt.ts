import { join } from 'node:path'
import * as FS from 'fs-extra'
import { loadTamagui } from '@tamagui/static'
import type { CLIResolvedOptions } from '@tamagui/types'

interface GeneratePromptOptions extends CLIResolvedOptions {
  output?: string
}

export async function generatePrompt(options: GeneratePromptOptions) {
  const { paths, output } = options

  // Regenerate the config first
  process.env.TAMAGUI_KEEP_THEMES = '1'
  await loadTamagui({
    ...options.tamaguiOptions,
    platform: 'web',
  })

  // Read the generated config
  const configPath = join(paths.dotDir, 'tamagui.config.json')

  if (!FS.existsSync(configPath)) {
    throw new Error(
      `Config file not found at ${configPath}. Please run 'tamagui generate' first.`
    )
  }

  const config = await FS.readJSON(configPath)

  // Generate markdown
  const markdown = generateMarkdown(config)

  // Write to file
  const outputPath = output || join(process.cwd(), 'tamagui-prompt.md')
  await FS.writeFile(outputPath, markdown, 'utf-8')

  console.info(`\n  ✓ Generated prompt file at ${outputPath}\n`)
}

function generateMarkdown(config: any): string {
  const sections: string[] = []

  // Header
  sections.push('# Tamagui Configuration\n\n')
  sections.push(
    'This document provides an overview of the Tamagui configuration for this project.\n\n'
  )

  // Get shorthands for use throughout the document
  const shorthands = config.tamaguiConfig?.shorthands || {}
  const reverseShorthands: Record<string, string> = {}
  for (const [short, full] of Object.entries(shorthands)) {
    reverseShorthands[full as string] = short
  }

  // Helper function to get the correct property name based on settings
  const getPropName = (fullProp: string): string => {
    const settings = config.tamaguiConfig?.settings || {}
    if (settings.onlyAllowShorthands && reverseShorthands[fullProp]) {
      return reverseShorthands[fullProp]
    }
    return fullProp
  }

  // Settings (moved to top)
  const settings = config.tamaguiConfig?.settings || {}
  if (Object.keys(settings).length > 0) {
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
        sections.push('- ✅ `<View w="$10" />` (correct)\n')
        sections.push('- ❌ `<View width="$10" />` (will error)\n\n')
        sections.push(
          'See the Shorthand Properties section below for all available shorthands.\n\n'
        )
      } else {
        sections.push('You can use either shorthand or full property names.\n\n')
      }
    }

    if (settings.themeClassNameOnRoot !== undefined) {
      sections.push(
        `### Theme Class Name on Root: \`${settings.themeClassNameOnRoot}\`\n\n`
      )
      if (settings.themeClassNameOnRoot) {
        sections.push('Theme classes are applied to the root HTML element.\n\n')
      }
    }

    // Check for platform-specific settings
    const platform = settings.platform || settings.defaultProps?.platform
    if (platform) {
      sections.push(`### Platform Mode: \`${platform}\`\n\n`)

      if (platform === 'web') {
        sections.push('This project is configured for **web only**.\n\n')
      } else if (platform === 'native') {
        sections.push('This project is configured for **React Native only**.\n\n')
      }
    }

    // Check for web-specific optimizations
    if (settings.webContainerType) {
      sections.push(`### Web Container Type: \`${settings.webContainerType}\`\n\n`)
      sections.push('Enables web-specific container query optimizations.\n\n')
    }

    // Check for strictness settings (common patterns)
    const configString = JSON.stringify(config.tamaguiConfig)
    if (configString.includes('semi-strict-web')) {
      sections.push('### Mode: `semi-strict-web`\n\n')
      sections.push('This configuration uses semi-strict-web mode, which:\n')
      sections.push('- Optimizes for web performance\n')
      sections.push('- May have limited React Native API support\n')
      sections.push('- Focuses on web-first development\n\n')
    }
  }

  // Store components section for later (will be output at the end)
  const componentsSection: string[] = []

  const allComponents: string[] = []
  for (const componentModule of config.components) {
    const componentNames = Object.keys(componentModule.nameToInfo)
    allComponents.push(...componentNames)
  }

  // Group components by prefix (e.g., Dialog, DialogClose -> Dialog.Close)
  // Strategy: Find potential base components and check if others follow the pattern
  const componentGroups = new Map<string, Set<string>>()
  const processed = new Set<string>()

  // Sort components to process shorter names first (potential base components)
  const sortedComponents = [...allComponents].sort((a, b) => a.length - b.length)

  for (const name of sortedComponents) {
    if (processed.has(name)) continue

    // Check if other components start with this name followed by an uppercase letter
    const children = allComponents.filter(
      (other) =>
        other !== name && other.startsWith(name) && other[name.length]?.match(/[A-Z]/)
    )

    if (children.length > 0) {
      // This is a base component with children
      componentGroups.set(name, new Set(children))
      processed.add(name)
      children.forEach((child) => processed.add(child))
    }
  }

  // Collect standalone components (not part of any group)
  const standaloneComponents = allComponents.filter((name) => !processed.has(name))

  componentsSection.push('## Components\n\n')
  componentsSection.push('The following components are available:\n\n')

  // Combine and sort all base components (both standalone and those with children)
  const allBaseComponents = [
    ...standaloneComponents,
    ...Array.from(componentGroups.keys()),
  ].sort()

  // Output components
  for (const name of allBaseComponents) {
    componentsSection.push(`- ${name}\n`)

    // If this component has children, output them
    if (componentGroups.has(name)) {
      const children = Array.from(componentGroups.get(name)!).sort()
      for (const child of children) {
        const suffix = child.slice(name.length)
        componentsSection.push(`  - ${name}.${suffix}\n`)
      }
    }
  }

  componentsSection.push('\n')

  // Shorthands
  sections.push('## Shorthand Properties\n\n')
  sections.push('These shorthand properties are available for styling:\n\n')

  const shorthandEntries = Object.entries(shorthands).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  sections.push(
    shorthandEntries.map(([short, full]) => `- \`${short}\` → \`${full}\``).join('\n')
  )
  sections.push('\n\n')

  // Themes
  sections.push('## Themes\n\n')

  const themes = config.tamaguiConfig?.themes || {}
  const themeNames = Object.keys(themes).sort()

  // Parse and hierarchically organize themes
  interface ThemeHierarchy {
    level1: Set<string> // light/dark
    level2: Set<string> // color names (blue, red, etc)
    level3: Set<string> // variants (alt1, alt2, etc)
    components: Set<string> // Component names
  }

  const hierarchy: ThemeHierarchy = {
    level1: new Set(),
    level2: new Set(),
    level3: new Set(),
    components: new Set(),
  }

  for (const themeName of themeNames) {
    const parts = themeName.split('_')

    // Level 1: light/dark
    if (parts[0] === 'light' || parts[0] === 'dark') {
      hierarchy.level1.add(parts[0])

      // Level 2: color names (blue, red, green, etc.)
      if (
        parts.length > 1 &&
        parts[1] &&
        !parts[1].startsWith('alt') &&
        parts[1] !== 'active'
      ) {
        // Check if it's not a component by looking if it starts with uppercase
        if (parts[1][0] === parts[1][0].toLowerCase()) {
          hierarchy.level2.add(parts[1])
        }
      }

      // Level 3: variants (alt1, alt2, etc.)
      for (const part of parts) {
        if (part.startsWith('alt') || part === 'active') {
          hierarchy.level3.add(part)
        }
      }

      // Components: parts that start with uppercase
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
      // Base theme without light/dark prefix
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

  // Add usage documentation
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
  sections.push('Components can access theme values using `$` token syntax:\n\n')
  sections.push('```tsx\n')
  sections.push(
    `<View ${getPropName('backgroundColor')}="$background" ${getPropName('color')}="$color" />\n`
  )
  sections.push('```\n\n')

  sections.push('**Special props:**\n\n')
  sections.push('- `inverse`: Automatically swaps light ↔ dark themes\n')
  sections.push('- `reset`: Reverts to grandparent theme\n\n')

  // Tokens
  sections.push('## Tokens\n\n')
  sections.push(
    'Tokens are design system values that can be referenced using the `$` prefix.\n\n'
  )

  const tokens = config.tamaguiConfig?.tokens || {}

  // Space tokens
  if (tokens.space) {
    sections.push('### Space Tokens\n\n')
    const spaceTokens = Object.entries(tokens.space).sort(([a], [b]) => {
      // Sort numerically where possible
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

  // Size tokens
  if (tokens.size) {
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

  // Radius tokens
  if (tokens.radius) {
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

  // zIndex tokens
  if (tokens.zIndex) {
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

  // Color tokens
  if (tokens.color) {
    sections.push('### Color Tokens\n\n')
    const colorTokens = Object.entries(tokens.color).sort(([a], [b]) =>
      a.localeCompare(b)
    )
    sections.push(
      colorTokens
        .map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`)
        .join('\n')
    )
    sections.push('\n\n')
  }

  // Token usage examples
  sections.push('### Token Usage\n\n')
  sections.push('Tokens can be used in component props with the `$` prefix:\n\n')
  sections.push('```tsx\n')
  sections.push('// Space tokens - for margin, padding, gap\n')
  sections.push(
    `<View ${getPropName('padding')}="$4" ${getPropName('gap')}="$2" ${getPropName('margin')}="$3" />\n\n`
  )
  sections.push('// Size tokens - for width, height, dimensions\n')
  sections.push(
    `<View ${getPropName('width')}="$10" ${getPropName('height')}="$6" />\n\n`
  )
  sections.push('// Color tokens - for colors and backgrounds\n')
  sections.push(
    `<View ${getPropName('backgroundColor')}="$blue5" ${getPropName('color')}="$gray12" />\n\n`
  )
  sections.push('// Radius tokens - for border-radius\n')
  sections.push(`<View ${getPropName('borderRadius')}="$4" />\n`)
  sections.push('```\n\n')

  // Media queries
  if (config.tamaguiConfig?.media) {
    sections.push('## Media Queries\n\n')
    sections.push('Available responsive breakpoints:\n\n')

    const media = config.tamaguiConfig.media
    const mediaEntries = Object.entries(media).sort(([a], [b]) => a.localeCompare(b))

    for (const [name, query] of mediaEntries) {
      sections.push(`- **${name}**: ${JSON.stringify(query)}\n`)
    }
    sections.push('\n')

    sections.push('### Media Query Usage\n\n')
    sections.push(
      'Media queries can be used as style props or with the `useMedia` hook:\n\n'
    )
    sections.push('```tsx\n')
    sections.push('// As style props (prefix with $)\n')

    // Get first media query name as example
    const firstMediaName = mediaEntries[0]?.[0]
    if (firstMediaName) {
      sections.push(
        `<View ${getPropName('width')}="100%" $${firstMediaName}={{ ${getPropName('width')}: "50%" }} />\n\n`
      )
    }

    sections.push('// Using the useMedia hook\n')
    sections.push('const media = useMedia()\n')
    if (firstMediaName) {
      sections.push(`if (media.${firstMediaName}) {\n`)
      sections.push('  // Render for this breakpoint\n')
      sections.push('}\n')
    }
    sections.push('```\n\n')
  }

  // Fonts
  if (config.tamaguiConfig?.fonts) {
    sections.push('## Fonts\n\n')
    sections.push('Available font families:\n\n')

    const fonts = config.tamaguiConfig.fonts
    const fontNames = Object.keys(fonts).sort()
    sections.push(fontNames.map((name) => `- ${name}`).join('\n'))
    sections.push('\n\n')
  }

  // Animations
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

  // Add components section at the end
  sections.push(...componentsSection)

  return sections.join('')
}

function formatTokenValue(value: any): string {
  // If it's an object with a 'val' property (token object), extract the value
  if (typeof value === 'object' && value !== null && 'val' in value) {
    return String(value.val)
  }
  // Otherwise, stringify it
  return String(value)
}
