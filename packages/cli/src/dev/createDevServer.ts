import { readFile } from 'fs/promises'

import { ResolvedOptions } from '../types.js'
import { DEFAULT_PORT } from '../utils/constants.js'
import { Server, createServer } from '../vendor/repack/dev-server/src'

export async function createDevServer(
  options: ResolvedOptions,
  {
    indexJson,
    getIndexBundle,
  }: { indexJson: Object; getIndexBundle: () => Promise<string> }
) {
  const { start, stop } = await createServer({
    options: {
      rootDir: options.root,
      host: options.host,
      port: options.port ?? DEFAULT_PORT,
      // https: args.https
      //   ? {
      //       cert: args.cert,
      //       key: args.key,
      //     }
      //   : undefined,
    },

    delegate: (ctx): Server.Delegate => {
      // if (args.interactive) {
      //   bindKeypressInput(ctx)
      // }

      // if (reversePort && args.port) {
      //   runAdbReverse(ctx, args.port)
      // }

      // let lastStats: webpack.StatsCompilation | undefined

      // compiler.on('watchRun', ({ platform }) => {
      //   ctx.notifyBuildStart(platform)
      //   if (platform === 'android') {
      //     runAdbReverse(ctx, args.port ?? DEFAULT_PORT)
      //   }
      // })

      // compiler.on('invalid', ({ platform }) => {
      //   ctx.notifyBuildStart(platform)
      //   ctx.broadcastToHmrClients({ action: 'building' }, platform)
      // })

      // compiler.on(
      //   'done',
      //   ({ platform, stats }: { platform: string; stats: webpack.StatsCompilation }) => {
      //     ctx.notifyBuildEnd(platform)
      //     lastStats = stats
      //     ctx.broadcastToHmrClients(
      //       { action: 'built', body: createHmrBody(stats) },
      //       platform
      //     )
      //   }
      // )

      return {
        compiler: {
          getAsset: async (filename, platform, sendProgress) => {
            console.log('get asset', filename)
            if (filename === 'index.bundle') {
              return await getIndexBundle()
            }
            return ''
            // return (await compiler.getAsset(filename, platform, sendProgress)).data
          },

          getMimeType: (filename) => {
            console.log('getMimeType', filename)
            return 'application/javascript'
            // return compiler.getMimeType(filename)
          },

          inferPlatform: (uri) => {
            return 'ios'

            const url = new URL(uri, 'protocol://domain')
            if (!url.searchParams.get('platform')) {
              const [, platform] = /^\/(.+)\/.+$/.exec(url.pathname) ?? []
              return platform
            }

            return undefined
          },
        },

        symbolicator: {
          getSource: async (fileUrl) => {
            console.log('get source', fileUrl)
            // const { filename, platform } = parseFileUrl(fileUrl)
            // return compiler.getSource(filename, platform)
            return ''
          },
          getSourceMap: async (fileUrl) => {
            console.log('get source map', fileUrl)
            // const { filename, platform } = parseFileUrl(fileUrl)
            // if (!platform) {
            //   throw new Error('Cannot infer platform for file URL')
            // }

            // return compiler.getSourceMap(filename, platform)
            return ''
          },
          shouldIncludeFrame: (frame) => {
            // If the frame points to internal bootstrap/module system logic, skip the code frame.
            return !/webpack[/\\]runtime[/\\].+\s/.test(frame.file)
          },
        },

        hmr: {
          getUriPath: () => '/__hmr',
          onClientConnected: (platform, clientId) => {
            // todo
            const lastStats = {}

            ctx.broadcastToHmrClients(
              { action: 'sync', body: createHmrBody(lastStats) },
              platform,
              [clientId]
            )
          },
        },

        messages: {
          getHello: () => indexJson,
          getStatus: () => 'packager-status:running',
        },

        logger: {
          onMessage: (log) => {
            const logEntry = makeLogEntryFromFastifyLog(log)
            logEntry.issuer = 'DevServer'
            console.log(
              logEntry.type,
              logEntry.issuer,
              JSON.stringify(logEntry.message, null, 2)
            )
            // reporter.process(logEntry)
          },
        },

        api: {
          // getPlatforms: async () => Object.keys(compiler.workers),
          getPlatforms: async () => ['ios'],
          getAssets: async (platform) => {
            console.log('get assets', platform)
            return []
            // return Object.entries(compiler.assetsCache[platform] ?? {}).map(([name, asset]) => ({
            //   name,
            //   size: asset.info.size,
            // })),
          },
          getCompilationStats: async (platform) => {
            return null
            // return compiler.statsCache[platform] ?? null
          },
        },
      }
    },
  })

  await start()

  return async () => {
    await stop()
  }
}

function createHmrBody(stats?: any): HMRMessageBody | null {
  if (!stats) {
    return null
  }

  const modules: Record<string, string> = {}
  for (const module of stats.modules ?? []) {
    const { identifier, name } = module
    if (identifier !== undefined && name) {
      modules[identifier] = name
    }
  }

  return {
    name: stats.name ?? '',
    time: stats.time ?? 0,
    hash: stats.hash ?? '',
    warnings: stats.warnings || [],
    errors: stats.errors || [],
    modules,
  }
}

/**
 * Represent Hot Module Replacement Update body.
 *
 * @internal
 */
export interface HMRMessageBody {
  name: string
  time: number
  hash: string
  warnings: any
  errors: any
  modules: Record<string, string>
}

/**
 * Represent Hot Module Replacement Update message.
 *
 * @internal
 */
export interface HMRMessage {
  action: 'building' | 'built' | 'sync'
  body: HMRMessageBody | null
}

function makeLogEntryFromFastifyLog(data: any): any {
  const { level, time, pid, hostname, ...rest } = data

  const levelToTypeMapping: Record<number, any> = {
    10: 'debug',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'error',
  }

  return {
    type: levelToTypeMapping[level],
    timestamp: time,
    issuer: '',
    message: [rest],
  }
}
