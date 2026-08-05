const babel = require('@babel/core')
const transformReactJsx = require('@babel/plugin-transform-react-jsx')

module.exports = {
  transform(args) {
    const result = babel.transformSync(args.src, {
      ast: true,
      babelrc: false,
      code: false,
      configFile: false,
      filename: args.filename,
      plugins: [
        ...args.plugins,
        function fixtureUserPlugin({ types }) {
          return {
            visitor: {
              Identifier(path) {
                if (path.node.name === 'USER_PLUGIN_VALUE') {
                  path.replaceWith(
                    types.numericLiteral(args.options.experimentalImportSupport ? 44 : 33)
                  )
                }
              },
            },
          }
        },
        [transformReactJsx, { runtime: 'automatic' }],
      ],
      sourceType: 'module',
    })
    return {
      ast: result.ast,
      metadata: { fixtureUserPlugin: 'ran-before-tamagui' },
    }
  },
  getCacheKey() {
    return 'e4-user-babel-transformer-v1'
  },
}
