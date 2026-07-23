import type { MetroCompilerFrontend } from './frontend'

export interface MetroGetTransformOptionsContext {
  dev: boolean
  hot: boolean
  platform: string | null
}

export type MetroGetTransformOptions = (
  this: unknown,
  entryFiles: string[],
  transformOptions: MetroGetTransformOptionsContext,
  getDependencies: (path: string) => Promise<string[]>
) => Promise<{ transform?: Record<string, any>; [key: string]: any }>

export function composeMetroGetTransformOptions(
  frontend: Pick<MetroCompilerFrontend, 'ensureValidCache'>,
  userGetTransformOptions?: MetroGetTransformOptions
): MetroGetTransformOptions {
  return async function (this: unknown, entryFiles, transformOptions, getDependencies) {
    const userOptions = userGetTransformOptions
      ? await userGetTransformOptions.call(
          this,
          entryFiles,
          transformOptions,
          getDependencies
        )
      : { transform: {} }
    await frontend.ensureValidCache({
      ...transformOptions,
      entryFiles,
      transform: userOptions.transform ?? {},
    })
    return userOptions
  }
}
