import { Plugin } from 'vite'

console.warn('TODO remove warning level "this" will be replaced by updating jsx strat')

export default () => {
  return {
    name: 'unagi:suppress-warnings',
    configResolved(config) {
      // TODO: Fix the actual issues that cause these warnings
      const filterOut = (msg: string) =>
        msg.includes(`Top-level "this" will be replaced`) ||
        msg.startsWith("react-native-reanimated doesn't appear to be written in CJS") ||
        msg.startsWith("expo-screen-orientation doesn't appear to be written in CJS") ||
        msg.startsWith("expo-linear-gradient doesn't appear to be written in CJS") ||
        (msg.includes('missing source files') && ['kolorist'].some((lib) => msg.includes(lib)))

      for (const method of ['warn', 'warnOnce'] as const) {
        const original = config.logger[method]
        config.logger[method] = (msg: string, ...args) => {
          if (filterOut(msg)) return
          return original(msg, ...args)
        }
      }
    },
  } as Plugin
}
