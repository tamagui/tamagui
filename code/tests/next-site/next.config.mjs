import { withTamagui } from '@tamagui/next-plugin'

Error.stackTraceLimit = Infinity

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
// process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD = '1'

const plugins = [
  withTamagui(
    // see tamagui.build.ts for details
  ),
  (config) => {
    return {
      ...config,
      webpack(webpackConfig, options) {
        webpackConfig.resolve.alias ??= {}

        if (process.env.PROFILE) {
          webpackConfig.resolve.alias['react-dom'] =
            require.resolve('react-dom/profiling')
          webpackConfig.optimization.minimize = false
        }

        if (process.env.ANALYZE === 'true') {
          const { StatsWriterPlugin } = require('webpack-stats-plugin')
          webpackConfig.plugins.push(
            new StatsWriterPlugin({
              // filename: 'stats.json',
              // stats: {
              //   all: false,
              // },
            })
          )
        }

        if (typeof config.webpack === 'function') {
          return config.webpack(webpackConfig, options)
        }

        return webpackConfig
      },
    }
  },
  (config) => {
    // for github pages
    if (process.env.IS_TAMAGUI_PROD) {
      config.assetPrefix = 'https://tamagui.dev'
    } else if (process.env.ON_GITHUB_PAGES) {
      config.basePath = '/tamagui'
      config.assetPrefix = '/tamagui/'
    }
    return config
  },
]

export default (name, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  let config = {
    // output: 'export',
    // runtime: 'experimental-edge',
    outputFileTracing: true,
    productionBrowserSourceMaps: process.env.ANALYZE === 'true',
    swcMinify: true,
    // must set to false if using reanimated
    reactStrictMode: true,
    optimizeFonts: true,
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: `@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}`,
        skipDefaultConversion: true,
      },
    },
    // async headers() {
    //   return [
    //     {
    //       source: "/api/:path*",
    //       headers: [
    // { key: "Access-Control-Allow-Origin", value: "*" },
    // { key: "Access-Control-Allow-Credentials", value: "true" },
    // { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
    // { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
    //       ]
    //     }
    //   ]
    // },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          port: '',
          pathname: '/**/**',
        },
      ],
    },
    experimental: {
      esmExternals: true,
      scrollRestoration: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    assetPrefix:
      process.env.VERCEL_GIT_COMMIT_REF === 'master' ? 'https://tamagui.dev' : undefined,

    // Next.js config
    async redirects() {
      return [
        {
          source: '/account/subscriptions',
          destination: '/account/items',
          permanent: false,
        },
        {
          source: '/docs',
          destination: '/docs/intro/introduction',
          permanent: true,
        },
        {
          source: '/vite',
          destination: 'https://vxrn.dev',
          permanent: true,
        },
        {
          source: '/docs/components/:slug/:version',
          destination: '/ui/:slug/:version',
          permanent: true,
        },
        {
          source: '/docs/components/:slug',
          destination: '/ui/:slug',
          permanent: true,
        },
      ]
    },
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
