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
    env: {
      targets: {
        node: '4',
      },
      include: [],
      // this breaks the uniswap app for any file with a ...spread
      exclude: [
        'transform-spread',
        'transform-destructuring',
        'transform-object-rest-spread',
        // `transform-async-to-generator` is relying on `transform-destructuring`.
        // If we exclude `transform-destructuring` but not `transform-async-to-generator`, the SWC binary will panic
        // with error: `called `Option::unwrap()` on a `None` value`.
        // See: https://github.com/swc-project/swc/blob/v1.7.14/crates/swc_ecma_compat_es2015/src/generator.rs#L703-L705
        'transform-async-to-generator',
        'transform-regenerator', // Similar to above
      ],
    },
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
