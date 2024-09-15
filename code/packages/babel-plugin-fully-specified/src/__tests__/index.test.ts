import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { type TransformOptions, transform, transformFileSync } from '@babel/core'

import plugin, { type FullySpecifiedOptions } from '../'

/** A helper function to get the default transform options for the plugin to test. */
const getTransformOptions = ({
  pluginOptions,
}: { pluginOptions?: Partial<FullySpecifiedOptions> } = {}) => ({
  plugins: [[plugin, { ensureFileExists: false, ...pluginOptions }]],
})

/** A test helper for calling Babel transform with the plugin to test and some default options. */
function getTransformResult(
  input,
  {
    transformOptions,
    pluginOptions,
  }: {
    transformOptions?: TransformOptions
    pluginOptions?: Partial<FullySpecifiedOptions>
  } = {}
) {
  return transform(input, {
    filename: 'myFile.js',
    configFile: false,
    ...transformOptions,
    ...getTransformOptions({ pluginOptions }),
  })
}

describe('local imports', () => {
  test('named import', () => {
    const example1 = "import { foo } from './foo'"
    expect(getTransformResult(example1)?.code).toBe('import { foo } from "./foo.mjs";')

    const example2 = "import { foo as bar } from './foo'"
    expect(getTransformResult(example2)?.code).toBe(
      'import { foo as bar } from "./foo.mjs";'
    )
  })

  test('default import', () => {
    const example1 = "import defaultFoo from './foo'"
    expect(getTransformResult(example1)?.code).toBe('import defaultFoo from "./foo.mjs";')

    const example2 = "import defaultFoo, { foo } from './foo'"
    expect(getTransformResult(example2)?.code).toBe(
      'import defaultFoo, { foo } from "./foo.mjs";'
    )
  })

  test('namespace import', () => {
    const example = "import * as fooModule from './foo'"
    expect(getTransformResult(example)?.code).toBe(
      'import * as fooModule from "./foo.mjs";'
    )
  })

  test('side effects only import', () => {
    const example = "import './foo'"
    expect(getTransformResult(example)?.code).toBe('import "./foo.mjs";')
  })

  test('dynamic import()', () => {
    const example = "const foo = await import('./foo')"
    expect(getTransformResult(example)?.code).toBe(
      'const foo = await import("./foo.mjs");'
    )
  })
})

describe('local re-exports', () => {
  test('named', () => {
    const example1 = "export { foo } from './foo'"
    expect(getTransformResult(example1)?.code).toBe('export { foo } from "./foo.mjs";')

    const example2 = "export { foo as bar } from './foo'"
    expect(getTransformResult(example2)?.code).toBe(
      'export { foo as bar } from "./foo.mjs";'
    )
  })

  test('default', () => {
    const example1 = "export { default as fooDefault } from './foo'"
    expect(getTransformResult(example1)?.code).toBe(
      'export { default as fooDefault } from "./foo.mjs";'
    )
  })

  test('namespace', () => {
    const example1 = "export * as fooModule from './foo'"
    expect(getTransformResult(example1)?.code).toBe(
      'export * as fooModule from "./foo.mjs";'
    )

    const example2 = "export * from './foo'"
    expect(getTransformResult(example2)?.code).toBe('export * from "./foo.mjs";')
  })
})

describe('transforming actual files', () => {
  test('multiple extensions exists', () => {
    const { code } =
      transformFileSync(
        path.join(__dirname, 'fixtures', 'multiple-extensions-exists', 'test.mjs'),
        getTransformOptions({
          pluginOptions: { ensureFileExists: true },
        })
      ) || {}

    expect(code).toMatchSnapshot()
  })
})
