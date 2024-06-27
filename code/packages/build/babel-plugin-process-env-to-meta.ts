import type babelCore from '@babel/core'

export default function viteMetaEnvBabelPlugin({
  template,
  types: t,
}: typeof babelCore): babelCore.PluginObj {
  return {
    name: 'vite-process-to-meta-env',
    visitor: {
      MemberExpression(path) {
        const envNode = t.isMemberExpression(path.node.object) && path.node.object
        const variableName = t.isIdentifier(path.node.property) && path.node.property.name

        if (!envNode || !variableName) {
          return
        }

        const isProcess =
          t.isIdentifier(envNode.object) && envNode.object.name === 'process'
        const isEnvVar =
          t.isIdentifier(envNode.property) && envNode.property.name === 'env'

        if (!isProcess || !isEnvVar) {
          return
        }

        path.replaceWith(
          template.expression('process.env.%%variableName%%')({
            variableName: variableName === 'NODE_ENV' ? 'MODE' : variableName,
          })
        )
      },
    },
  }
}
