import Static from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/types'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { LoaderContext } from 'webpack'
import { requireResolve } from './requireResolve'
import {
  getWebpackZeroController,
  publishZeroBuildInfo,
  zeroModuleKey,
} from './zeroRuntime'

const { getPragmaOptions } = Static

Error.stackTraceLimit = Number.POSITIVE_INFINITY

// Resolve through the package export so both ESM and CJS entry points select a
// real, requireable webpack loader artifact.
const CSS_LOADER_PATH = requireResolve('tamagui-loader/css')

let index = 0
const compilerFrontends = new Map<string, InstanceType<typeof Static.CompilerFrontend>>()

process.env.TAMAGUI_TARGET = 'web'

export const loader = async function loader(
  this: LoaderContext<TamaguiOptions>,
  sourceIn: Buffer | string
) {
  this.cacheable(true)
  const callback = this.async()
  const sourcePath = `${this.resourcePath}`

  if (sourcePath.includes('node_modules') || sourcePath.includes('lucide-icons')) {
    return callback(null, sourceIn)
  }

  const source = sourceIn.toString()

  try {
    const options: TamaguiOptions = {
      // @ts-ignore
      platform: 'web',
      ...this.getOptions(),
    }

    const { shouldDisable, shouldPrintDebug } = await getPragmaOptions({
      source,
      path: sourcePath,
    })

    if (shouldPrintDebug === 'verbose') {
      console.warn(`\n\n --- Incoming source --- \n\n`)
      console.warn(source)
    }

    if (options.disableExtraction || shouldDisable) {
      if (shouldPrintDebug) {
        console.info(
          options.disableExtraction
            ? 'Disabling extraction via loader options'
            : 'Disabling on file via pragma'
        )
      }
      return callback(null, source)
    }

    const cssPath = `${sourcePath}.${index++}.tamagui.css`

    const root = this.rootContext || process.cwd()
    const key = createHash('sha256')
      .update(root)
      .update('\0')
      .update(options.config || 'tamagui.config.ts')
      .update('\0')
      .update(JSON.stringify(options.components || []))
      .digest('hex')
    let compiler = compilerFrontends.get(key)
    if (!compiler) {
      compiler = new Static.CompilerFrontend()
      compilerFrontends.set(key, compiler)
    }
    const zero = getWebpackZeroController(options, root)
    const projectInfo = await Static.loadTamagui(
      // in zero mode the integration owns the one generated CSS artifact, so
      // config-only CSS is never written to that path
      zero ? { ...options, outputCSS: undefined } : options
    )
    if (!projectInfo) {
      throw new Error('Unable to load the Tamagui project for webpack compilation')
    }
    const webpackResolve = this.getResolve({})
    const componentModules = await Promise.all(
      [...new Set(['@tamagui/core', ...(options.components || [])])].map(
        async (moduleName) => ({
          moduleName,
          id: await webpackResolve(path.dirname(sourcePath), moduleName),
        })
      )
    )
    const extracted = await compiler.compile({
      id: sourcePath,
      source,
      root,
      target: 'web',
      project: {
        projectInfo,
        componentModules,
        generation: key,
      },
      resolve: async (specifier, importer) => {
        try {
          return { id: await webpackResolve(path.dirname(importer), specifier) }
        } catch {
          return null
        }
      },
      load: async (id) => {
        try {
          return await readFile(id.split(/[?#]/, 1)[0], 'utf8')
        } catch {
          return null
        }
      },
    })

    // island child compilation: the parent owns the one CSS artifact, so route
    // this module's atomic rules there and inject nothing
    if (zero?.islandBuild) {
      publishZeroBuildInfo(zero, this, {
        island: zero.islandBuild,
        css: extracted.plan.css,
        bridgeCSS: [],
        bridges: [],
        violations: [],
      })
      return callback(null, extracted.output.code, extracted.output.map as any)
    }

    if (zero) {
      // Only app-authored modules are zero-transformed. A workspace dependency
      // resolves outside node_modules in this monorepo, and erasing Tamagui's own
      // re-exports inside its dist would break the package itself.
      const relative = path.relative(root, sourcePath)
      const isAppSource =
        relative !== '' &&
        !relative.startsWith(`..${path.sep}`) &&
        !relative.split(path.sep).includes('node_modules')
      if (!isAppSource) {
        return callback(null, extracted.output.code, extracted.output.map as any)
      }

      const zeroResult = Static.transformZeroModule({
        id: sourcePath,
        root,
        source,
        plan: extracted.plan,
        config: projectInfo.tamaguiConfig!,
        isTamaguiSpecifier: (specifier) =>
          specifier === 'tamagui' || specifier.startsWith('@tamagui/'),
        resolveIslandLoader: (specifier) => {
          const islandId = zero.loaderIds.get(
            zeroModuleKey(path.resolve(path.dirname(sourcePath), specifier))
          )
          return islandId ? { islandId } : null
        },
        resolveIslandModule: (specifier) =>
          zero.islandModuleIds.get(
            zeroModuleKey(path.resolve(path.dirname(sourcePath), specifier))
          ) ?? null,
      })
      publishZeroBuildInfo(zero, this, {
        island: null,
        css: extracted.plan.css,
        bridgeCSS: [...zeroResult.bridgeCSS],
        bridges: [...zeroResult.bridges],
        violations: zeroResult.violations.map((violation) => {
          const { line, column } = Static.offsetToLineColumn(source, violation.span.start)
          return {
            file: path.relative(root, sourcePath),
            line,
            column,
            code: violation.code,
            message: violation.message,
          }
        }),
      })
      return callback(null, zeroResult.output.code, zeroResult.output.map as any)
    }

    // add import to css
    let code = extracted.output.code
    if (extracted.plan.css) {
      const cssQuery = `cssData=${Buffer.from(extracted.plan.css).toString('base64url')}`
      const remReq = this.remainingRequest
      const importPath = `${cssPath}!=!${CSS_LOADER_PATH}?${cssQuery}!${remReq}`
      code = `${code}\n\nrequire(${JSON.stringify(importPath)})`
    }

    callback(null, code, extracted.output.map as any)
  } catch (err) {
    const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)

    console.error('Tamagui Webpack Loader Error:\n', `  ${message}\n`)

    if (message.includes('Cannot create proxy')) {
      console.info(
        'This is usually due to components not loading at build-time. Check for logs just below the line above:'
      )
    }

    callback(err instanceof Error ? err : new Error(message))
  }
}
