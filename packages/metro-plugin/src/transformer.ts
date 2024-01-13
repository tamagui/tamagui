import worker, {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from 'metro-transform-worker'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

import { createExtractor, extractToClassNames, TamaguiOptions } from '@tamagui/static'

interface NativeWindJsTransformerConfig extends JsTransformerConfig {
  transformerPath?: string
  tamagui: TamaguiOptions
}

const extractor = createExtractor()

export async function transform(
  config: NativeWindJsTransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: JsTransformOptions
): Promise<TransformResponse> {
  const transformer = config.transformerPath
    ? require(config.transformerPath).transform
    : worker.transform

  if (options.platform !== 'web' || filename.includes('node_modules')) {
    return transformer(config, projectRoot, filename, data, options)
  }

  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
    const tmpDir = join(projectRoot, '.tamagui', 'css')
    try {
      await mkdir(tmpDir, {
        recursive: true,
      })
    } catch {}

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
      const outStylePath = join(
        tmpDir,
        `${filename}`.replace(/[^a-zA-Z0-9]/gi, '') + '.css'
      )
      console.info(' 🥚', outStylePath)
      await writeFile(outStylePath, out.styles)
      return transformer(
        config,
        projectRoot,
        filename,
        Buffer.from(`${out.js}\nrequire("${outStylePath}")`),
        options
      )
    }
  }

  return transformer(config, projectRoot, filename, data, options)
}
