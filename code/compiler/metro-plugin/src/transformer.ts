import { outputFile, pathExists } from 'fs-extra'
import type {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from 'metro-transform-worker'
import worker from 'metro-transform-worker'
import { join, posix, sep } from 'node:path'

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
  const ogPath = config['ogTransformPath'] || config.transformerPath
  const transformer = ogPath ? require(ogPath).transform : worker.transform

  if (
    config.tamagui.disable ||
    options.platform !== 'web' ||
    options.type === 'asset' ||
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
    const sourcePath = toPosixPath(join(projectRoot, filename))

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
      const outStylePath = toPosixPath(
        join(tmpDir, `${filename}`.replace(/[^a-zA-Z0-9]/gi, '') + '.css')
      )
      if (process.env.DEBUG?.includes('tamagui')) {
        console.info(' Outputting CSS file:', outStylePath)
      }

      if (process.env.TAMAGUI_METRO_INLINE_CSS !== '0') {
        const cssInjectionCode = `
          (function() {
            if (typeof document !== 'undefined') {
              var css = ${JSON.stringify(out.styles)};
              var style = document.createElement('style');
              style.type = 'text/css';
              style.appendChild(document.createTextNode(css));
              document.head.appendChild(style);
            }
          })();
          `

        return transformer(
          config,
          projectRoot,
          filename,
          Buffer.from(`${out.js}\n${cssInjectionCode}`, 'utf-8'),
          options
        )
      }

      const existsAlready = await pathExists(outStylePath)

      await outputFile(outStylePath, out.styles, 'utf-8')

      if (!existsAlready) {
        // metro has some sort of bug, expo starter wont build properly first time without this... :(
        await new Promise((res) =>
          setTimeout(
            res,
            process.env.TAMAGUI_METRO_CSS_EMIT_DELAY
              ? +process.env.TAMAGUI_METRO_CSS_EMIT_DELAY
              : 1000
          )
        )
      }

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

function toPosixPath(path: string) {
  return path.split(sep).join(posix.sep)
}
