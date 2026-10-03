import { generateConfigMarkdown } from '@tamagui/static'
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
  await loadTamagui({ ...options.tamaguiOptions, platform: 'web' }, true)

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
  const markdown = generateConfigMarkdown(config, { styleValueSyntax: resolvedSyntax })

  // write to file
  const outputPath = output || join(process.cwd(), 'tamagui-prompt.md')
  await FS.writeFile(outputPath, markdown, 'utf-8')

  console.info(`\n  ✓ Generated prompt file at ${outputPath}\n`)
}
