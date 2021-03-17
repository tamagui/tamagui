import * as babel from '@babel/core'

export function extractBabel(code: string) {
  return babel.transformSync(code, {
    filename: 'test.tsx',
    plugins: [
      require('@snackui/babel-plugin'),
      [
        '@babel/plugin-syntax-typescript',
        {
          isTSX: true,
        },
      ],
    ],
  })
}
