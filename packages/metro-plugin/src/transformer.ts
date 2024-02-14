import type {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from 'metro-transform-worker'
import worker from 'metro-transform-worker'
import { join } from 'path'
import { outputFile } from 'fs-extra'

import type { TamaguiOptions } from '@tamagui/static'
import { createExtractor, extractToClassNames } from '@tamagui/static'

interface TamaguiJsTransformerConfig extends JsTransformerConfig {
  transformerPath?: string
  tamagui: TamaguiOptions
}

const extractor = createExtractor()

export async function transform(
  config: TamaguiJsTransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: JsTransformOptions
): Promise<TransformResponse> {
  const transformer = config.transformerPath
    ? require(config.transformerPath).transform
    : worker.transform

  if (
    config.tamagui.disable ||
    options.platform !== 'web' ||
    filename.includes('node_modules')
  ) {
    return transformer(config, projectRoot, filename, data, options)
  }

  if (
    // could by a styled() call:
    filename.endsWith('.ts') ||
    filename.endsWith('.tsx') ||
    filename.endsWith('.jsx')
  ) {
    const sourcePath = join(projectRoot, filename)

    // extract css
    const source = `${data}`
    const out = await extractToClassNames({
      extractor,
      options: {
        // @ts-ignore
        platform: 'web',
        ...config.tamagui,
      },
      shouldPrintDebug: source.startsWith('// debug-verbose')
        ? 'verbose'
        : source.startsWith('// debug'),
      source,
      sourcePath,
    })

    // just write it out to our tmp dir and require it for metro to do the rest of the css work
    if (out?.styles) {
      const tmpDir = join(projectRoot, '.tamagui', 'css')
      const outStylePath = join(
        tmpDir,
        `${filename}`.replace(/[^a-zA-Z0-9]/gi, '') + '.css'
      )
      if (process.env.DEBUG?.includes('tamagui')) {
        console.info(' Outputting CSS file:', outStylePath)
      }
      await outputFile(outStylePath, out.styles, 'utf-8')
      // attempt temp bugfix for metro not finding file right away for some reason
      await new Promise((res) => setTimeout(res, 25))
      return transformer(
        config,
        projectRoot,
        filename,
        Buffer.from(`${out.js}\nrequire("${outStylePath}")`, 'utf-8'),
        options
      )
    }
  }

  return transformer(config, projectRoot, filename, data, options)
}
