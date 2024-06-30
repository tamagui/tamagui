import { describe, expect, test, it } from '@jest/globals'
import { type TransformOptions, transform } from '@babel/core'

import plugin, { type FullySpecifiedOptions } from '../src'

/** A test helper for calling Babel transform with the plugin to test and some default options. */
function getTransformResult(
  input,
  {
    transformOptions,
    pluginOptions,
  }: { transformOptions?: TransformOptions; pluginOptions?: FullySpecifiedOptions } = {}
) {
  return transform(input, {
    filename: 'myFile.js',
    configFile: false,
    ...transformOptions,
    plugins: [[plugin, { ensureFileExists: false, ...pluginOptions }]],
  })
}

describe('local imports', () => {
  test('named import', () => {
    const example1 = "import { foo } from './foo'"
    expect(getTransformResult(example1)?.code).toBe('import { foo } from "./foo.js";')

    const example2 = "import { foo as bar } from './foo'"
    expect(getTransformResult(example2)?.code).toBe(
      'import { foo as bar } from "./foo.js";'
    )
  })

  test('default import', () => {
    const example1 = "import defaultFoo from './foo'"
    expect(getTransformResult(example1)?.code).toBe('import defaultFoo from "./foo.js";')

    const example2 = "import defaultFoo, { foo } from './foo'"
    expect(getTransformResult(example2)?.code).toBe(
      'import defaultFoo, { foo } from "./foo.js";'
    )
  })

  test('namespace import', () => {
    const example = "import * as fooModule from './foo'"
    expect(getTransformResult(example)?.code).toBe(
      'import * as fooModule from "./foo.js";'
    )
  })

  test('side effects only import', () => {
    const example = "import './foo'"
    expect(getTransformResult(example)?.code).toBe('import "./foo.js";')
  })
})

describe('local re-exports', () => {
  test('named', () => {
    const example1 = "export { foo } from './foo'"
    expect(getTransformResult(example1)?.code).toBe('export { foo } from "./foo.js";')

    const example2 = "export { foo as bar } from './foo'"
    expect(getTransformResult(example2)?.code).toBe(
      'export { foo as bar } from "./foo.js";'
    )
  })

  test('default', () => {
    const example1 = "export { default as fooDefault } from './foo'"
    expect(getTransformResult(example1)?.code).toBe(
      'export { default as fooDefault } from "./foo.js";'
    )
  })

  test('namespace', () => {
    const example1 = "export * as fooModule from './foo'"
    expect(getTransformResult(example1)?.code).toBe(
      'export * as fooModule from "./foo.js";'
    )

    const example2 = "export * from './foo'"
    expect(getTransformResult(example2)?.code).toBe('export * from "./foo.js";')
  })
})
