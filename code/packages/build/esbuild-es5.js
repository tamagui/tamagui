/**
 * MIT License

Copyright (c) 2023 Youbao Nong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

/**
 * A plugin for the esbuild
 * convert code to es5 use @swc/core
 */

const { transformFile: _transformFile } = require('@swc/core')

function transformFile(file, options) {
  const isTs = file.endsWith('.ts') || file.endsWith('.tsx')
  const isReact = file.endsWith('.jsx') || file.endsWith('.tsx')
  let transformOptions = {
    jsc: {
      preserveAllComments: true,
      externalHelpers: false,
      transform: {
        react: {
          runtime: 'automatic',
          development: false,
        },
      },
      parser: {
        syntax: isTs ? 'typescript' : 'ecmascript',
        tsx: isReact && isTs,
        jsx: isReact && !isTs,
      },
      target: 'es5',
    },
    module: { type: 'es6' },
    sourceFileName: file,
    isModule: true,
    ...options,
  }
  return _transformFile(file, transformOptions)
}

exports.es5Plugin = function es5Plugin() {
  return {
    name: 'es5',
    setup(build) {
      const buildOptions = build.initialOptions
      const enableSourcemap = !!buildOptions.sourcemap

      build.onLoad({ filter: /\.([tj]sx?|mjs)$/ }, (args) => {
        return new Promise((resolve) => {
          transformFile(args.path, {
            /**
             * Generate inline source maps to enable esbuild to properly handle sourcemaps.
             */
            sourceMaps: enableSourcemap ? 'inline' : false,
          })
            .then(({ code }) => {
              resolve({ contents: code, loader: 'js' })
            })
            .catch((error) => {
              resolve({ pluginName: 'es5', errors: [convertError(error)] })
            })
        })
      })
    },
  }
}

const convertError = (error) => {
  return {
    pluginName: 'esbuild-plugin-es5',
    text: error.message,
  }
}
