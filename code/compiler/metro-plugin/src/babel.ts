import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

export interface MetroBabelTransformArgs {
  filename: string
  src: string
  options: Record<string, any>
  plugins: unknown[]
}

export interface MetroBabelTransformResult {
  ast: Record<string, any>
  metadata?: Record<string, any>
  functionMap?: unknown
  [key: string]: unknown
}

export interface CompiledMetroModule {
  code: string
  map: Record<string, any>
  result: MetroBabelTransformResult
}

type BabelTransformer = {
  transform(
    args: MetroBabelTransformArgs
  ): MetroBabelTransformResult | Promise<MetroBabelTransformResult>
  getCacheKey?(): string
}

function asTransformer(module: any, path: string): BabelTransformer {
  const transformer = module?.default?.transform ? module.default : module
  if (!transformer || typeof transformer.transform !== 'function') {
    throw new Error(`Metro Babel transformer ${path} has no transform function`)
  }
  return transformer
}

export function loadMetroBabelTransformer(path: string): BabelTransformer {
  return asTransformer(createRequire(path)(path), path)
}

export async function compileWithUserBabel(
  transformerPath: string,
  args: MetroBabelTransformArgs
): Promise<CompiledMetroModule> {
  const transformer = loadMetroBabelTransformer(transformerPath)
  const result = await transformer.transform(args)
  if (!result?.ast) {
    throw new Error(`Metro Babel transformer ${transformerPath} returned no AST`)
  }
  const requireFromTransformer = createRequire(transformerPath)
  const generatorModule = requireFromTransformer('@babel/generator')
  const generate = generatorModule.default ?? generatorModule
  const generated = generate(
    result.ast,
    {
      comments: true,
      compact: false,
      retainLines: true,
      sourceFileName: args.filename,
      sourceMaps: true,
    },
    args.src
  )
  if (!generated || typeof generated.code !== 'string') {
    throw new Error(`Babel generator for ${transformerPath} returned no code`)
  }
  if (!generated.map) {
    throw new Error(`Babel generator for ${transformerPath} returned no source map`)
  }
  return { code: generated.code, map: generated.map, result }
}

export function userBabelCacheKey(transformerPath: string): string {
  const transformer = loadMetroBabelTransformer(transformerPath)
  return createHash('sha256')
    .update(transformerPath)
    .update('\0')
    .update(transformer.getCacheKey?.() ?? '')
    .digest('hex')
}

export function transformerDirectory(transformerPath: string): string {
  return dirname(transformerPath)
}
