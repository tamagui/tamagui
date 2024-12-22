import type { Logger, TamaguiOptions } from '@tamagui/static'

const importStatic = async () => {
  return (await import('@tamagui/static')).default
}

type StaticI = Awaited<ReturnType<typeof importStatic>>

export let tamaguiOptions: TamaguiOptions | null = null
export let Static: StaticI | null = null
export let extractor: ReturnType<StaticI['createExtractor']> | null = null
export let disableStatic = false

export const getStatic = async () => {
  if (Static) return Static
  Static = await importStatic()
  return Static!
}

let isLoading: null | Promise<void> = null

export async function loadTamaguiBuildConfig(
  optionsIn?: Partial<TamaguiOptions>,
  logger?: Logger
) {
  if (extractor) return
  if (isLoading) return await isLoading

  let resolve
  isLoading = new Promise((res) => {
    resolve = res
  })

  try {
    // only do it once
    if (!Static) {
      await getStatic()

      tamaguiOptions = Static!.loadTamaguiBuildConfigSync({
        ...optionsIn,
        platform: 'web',
      })

      disableStatic = Boolean(tamaguiOptions.disable)
      extractor = Static!.createExtractor({
        logger,
      })
    }

    if (optionsIn?.disableWatchTamaguiConfig) {
      return
    }

    if (extractor) {
      await extractor.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...tamaguiOptions,
      } satisfies TamaguiOptions)
    }
  } finally {
    resolve()
    isLoading = null
  }
}
