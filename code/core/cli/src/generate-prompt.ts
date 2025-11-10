import { join } from 'node:path'
import * as FS from 'fs-extra'
import { loadTamagui } from '@tamagui/static'
import type { CLIResolvedOptions } from '@tamagui/types'

interface GeneratePromptOptions extends CLIResolvedOptions {
  verbose?: boolean
  output?: string
}

export async function generatePrompt(options: GeneratePromptOptions) {
  const { paths, verbose, output } = options

  // Regenerate the config first
  console.info('Regenerating Tamagui configuration...')
  process.env.TAMAGUI_KEEP_THEMES = '1'
  await loadTamagui({
    ...options.tamaguiOptions,
    platform: 'web',
  })

  // Read the generated config
  const configPath = join(paths.dotDir, 'tamagui.config.json')

  if (!FS.existsSync(configPath)) {
    throw new Error(`Config file not found at ${configPath}. Please run 'tamagui generate' first.`)
  }

  const config = await FS.readJSON(configPath)

  // Generate markdown
  const markdown = generateMarkdown(config, verbose)

  // Write to file
  const outputPath = output || join(process.cwd(), 'tamagui-prompt.md')
  await FS.writeFile(outputPath, markdown, 'utf-8')

  console.info(`✓ Generated prompt file at ${outputPath}`)
}

function generateMarkdown(config: any, verbose = false): string {
  const sections: string[] = []

  // Header
  sections.push('# Tamagui Configuration\n\n')
  sections.push('This document provides an overview of the Tamagui configuration for this project.\n\n')

  // Components
  sections.push('## Components\n\n')
  sections.push('The following components are available:\n')

  const allComponents: string[] = []
  for (const componentModule of config.components) {
    const componentNames = Object.keys(componentModule.nameToInfo)
    allComponents.push(...componentNames)
  }

  // Sort and list components
  const sortedComponents = allComponents.sort()
  sections.push(sortedComponents.map(name => `- ${name}`).join('\n'))
  sections.push('\n\n')

  // Shorthands
  sections.push('## Shorthand Properties\n\n')
  sections.push('These shorthand properties are available for styling:\n\n')

  const shorthands = config.tamaguiConfig?.shorthands || {}
  const shorthandEntries = Object.entries(shorthands).sort(([a], [b]) => a.localeCompare(b))

  sections.push(shorthandEntries.map(([short, full]) => `- \`${short}\` → \`${full}\``).join('\n'))
  sections.push('\n\n')

  // Themes
  sections.push('## Themes\n\n')
  sections.push('Available theme names:\n\n')

  const themes = config.tamaguiConfig?.themes || {}
  const themeNames = Object.keys(themes).sort()

  // Group themes by prefix for better organization
  const baseThemes = themeNames.filter(name => !name.includes('_'))
  const componentThemes = themeNames.filter(name => name.includes('_'))

  if (baseThemes.length > 0) {
    sections.push('### Base Themes\n\n')
    sections.push(baseThemes.map(name => `- ${name}`).join('\n'))
  }

  if (componentThemes.length > 0 && verbose) {
    sections.push('\n\n### Component-Specific Themes\n\n')
    sections.push(componentThemes.map(name => `- ${name}`).join('\n'))
  } else if (componentThemes.length > 0) {
    sections.push(`\n\n*${componentThemes.length} component-specific theme variants available (use --verbose to see all)*\n`)
  }

  sections.push('\n\n')

  // Tokens (non-color)
  sections.push('## Tokens\n\n')

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
    sections.push(spaceTokens.map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`).join('\n'))
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
    sections.push(sizeTokens.map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`).join('\n'))
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
    sections.push(radiusTokens.map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`).join('\n'))
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
    sections.push(zIndexTokens.map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`).join('\n'))
    sections.push('\n\n')
  }

  // Color tokens (only in verbose mode)
  if (verbose && tokens.color) {
    sections.push('### Color Tokens\n\n')
    const colorTokens = Object.entries(tokens.color).sort(([a], [b]) => a.localeCompare(b))
    sections.push(colorTokens.map(([key, value]) => `- \`${key}\`: ${formatTokenValue(value)}`).join('\n'))
    sections.push('\n\n')
  } else if (tokens.color) {
    const colorCount = Object.keys(tokens.color).length
    sections.push(`*${colorCount} color tokens available (use --verbose to see all)*\n\n`)
  }

  // Media queries
  if (config.tamaguiConfig?.media) {
    sections.push('## Media Queries\n\n')
    sections.push('Responsive breakpoints and media query configurations:\n\n')

    const media = config.tamaguiConfig.media
    const mediaEntries = Object.entries(media).sort(([a], [b]) => a.localeCompare(b))

    sections.push('```typescript\n')
    for (const [name, query] of mediaEntries) {
      sections.push(`${name}: ${JSON.stringify(query)}\n`)
    }
    sections.push('```\n\n')
  }

  // Fonts
  if (config.tamaguiConfig?.fonts) {
    sections.push('## Fonts\n\n')
    sections.push('Available font families:\n\n')

    const fonts = config.tamaguiConfig.fonts
    const fontNames = Object.keys(fonts).sort()
    sections.push(fontNames.map(name => `- ${name}`).join('\n'))
    sections.push('\n\n')
  }

  // Animations
  if (config.tamaguiConfig?.animations) {
    sections.push('## Animations\n\n')
    sections.push('Available animation presets:\n\n')

    const animations = config.tamaguiConfig.animations
    if (animations.animations) {
      const animationNames = Object.keys(animations.animations).sort()
      sections.push(animationNames.map(name => `- ${name}`).join('\n'))
      sections.push('\n\n')
    }
  }

  // Settings
  if (config.tamaguiConfig?.settings) {
    sections.push('## Settings\n\n')
    const settings = config.tamaguiConfig.settings

    if (settings.defaultFont) {
      sections.push(`- **Default Font**: ${settings.defaultFont}\n`)
    }
    if (settings.onlyAllowShorthands !== undefined) {
      sections.push(`- **Only Allow Shorthands**: ${settings.onlyAllowShorthands}\n`)
    }
    if (settings.themeClassNameOnRoot !== undefined) {
      sections.push(`- **Theme Class Name on Root**: ${settings.themeClassNameOnRoot}\n`)
    }
    sections.push('\n')
  }

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
