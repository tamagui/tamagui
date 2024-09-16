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

    // inject the styles in place. This is in lieu of previous behavior that
    // wrote to the fs. Not supported by metro mental modal
    if (out?.styles) {
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
      `;

      return transformer(
        config,
        projectRoot,
        filename,
        Buffer.from(`${out.js}\n${cssInjectionCode}`, 'utf-8'),
        options
      );
    }
  }

  return transformer(config, projectRoot, filename, data, options)
}

function toPosixPath(path: string) {
  return path.split(sep).join(posix.sep)
}
