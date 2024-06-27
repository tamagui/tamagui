/**
 * alias plugin
 * @description
 * config example:
 * ```
 * {
 *   '@lib': '/some/absolute/path'
 * }
 * ```
 * then `import { something } from '@lib/xxx'` will be transformed to
 * `import { something } from '/some/absolute/path/xxx'`
 * @param {object} config
 */
const aliasPlugin = (config) => {
  const alias = config && Object.keys(config)
  return {
    name: 'path-alias',

    setup(build) {
      if (!alias || !alias.length) {
        return
      }
      const main = (k, args) => {
        const targetPath = config[k].replace(/\/$/, '')
        return {
          path: targetPath,
        }
      }

      alias.forEach((k) => {
        build.onResolve({ filter: new RegExp(`^.*${k}$`) }, (args) => {
          return main(k, args)
        })
        build.onResolve({ filter: new RegExp(`^.*\\/${k}\\/.*$`) }, (args) => {
          return main(k, args)
        })
      })
    },
  }
}

module.exports = aliasPlugin
