import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import open from 'opener'

export interface PreviewThemeOptions {
  theme?: string
  themeArg?: string
  url?: string
  print?: boolean
}

export async function previewTheme(options: PreviewThemeOptions) {
  const themeInput = (options.theme || options.themeArg || '').trim()
  let themeData: any = null

  if (themeInput) {
    if (themeInput.startsWith('{') || themeInput.startsWith('[')) {
      try {
        themeData = JSON.parse(themeInput)
      } catch (err: any) {
        throw new Error(`Invalid JSON provided for --theme: ${err.message}`)
      }
    } else {
      const filePath = path.resolve(process.cwd(), themeInput)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Theme file not found at: ${filePath}`)
      }
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        themeData = JSON.parse(fileContent)
      } catch (err: any) {
        throw new Error(`Failed to read theme file ${filePath}: ${err.message}`)
      }
    }
  }

  const baseUrl = options.url || 'https://tamagui.dev/theme'
  let targetUrl = baseUrl

  if (themeData) {
    const jsonStr = JSON.stringify(themeData)
    const base64 = Buffer.from(jsonStr).toString('base64')
    targetUrl = `${baseUrl}#theme=${encodeURIComponent(base64)}`
  }

  if (options.print) {
    console.info(targetUrl)
    return
  }

  console.info(chalk.green(`Opening theme preview:`), targetUrl)
  open(targetUrl)
}
