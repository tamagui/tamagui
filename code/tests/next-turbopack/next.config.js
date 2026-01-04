/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['react-native-web'],
  experimental: {
    scrollRestoration: true,
  },
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
  },
}
