import { resolve } from 'node:path'

import { build } from 'esbuild'
import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative, extractForWeb } from './lib/extract'

window['React'] = React

const repositoryRoot = resolve(process.cwd(), '../../..')

async function bundledInputs(source: string, target: 'web' | 'native') {
  const result = await build({
    absWorkingDir: repositoryRoot,
    stdin: {
      contents: source,
      loader: 'tsx',
      resolveDir: repositoryRoot,
      sourcefile: `dom-${target}-fixture.tsx`,
    },
    bundle: true,
    write: false,
    metafile: true,
    platform: target === 'web' ? 'browser' : 'neutral',
    format: 'esm',
    conditions:
      target === 'web'
        ? ['browser', 'module', 'import']
        : ['react-native', 'module', 'import'],
    alias:
      target === 'native'
        ? {
            '@tamagui/core/dom': resolve(
              repositoryRoot,
              'code/core/core/dist/esm/dom.native.js'
            ),
          }
        : undefined,
    external: ['react', 'react/*', 'react-native', 'react-native/*'],
    logLevel: 'silent',
  })
  return Object.keys(result.metafile.inputs).map((file) =>
    resolve(repositoryRoot, file).replaceAll('\\', '/')
  )
}

test('DOM elements lower to literal tags through every normalized element form', async () => {
  const output = await extractForWeb(
    `
    import React, { createElement } from 'react'
    import { jsx, jsxs } from 'react/jsx-runtime'
    import { html as h } from '@tamagui/core'

    export const JSXElement = <h.main id="main"><h.h1>Title</h.h1></h.main>
    export const JSXCall = jsx(h.section, { children: 'jsx' })
    export const JSXSCall = jsxs(h.nav, { children: ['one', jsx(h.span, { children: 'two' })] })
    export const CreateElementCall = createElement(h.article, null, 'named')
    export const MemberCreateElementCall = React.createElement(h.footer, null, 'member')
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.diagnostics).toEqual([])
  expect(output?.js).toMatchSnapshot()
})

test('DOM table diagnostics cover unsupported props, tags and nesting', async () => {
  const output = await extractForWeb(
    `
    import { html } from '@tamagui/core'
    export const Invalid = () => (
      <>
        <html.div href="/wrong" />
        <html.span><html.div /></html.span>
        <html.video />
      </>
    )
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.diagnostics.map(({ code, message }) => ({ code, message }))).toEqual([
    {
      code: 'local/unsupported-prop-key',
      message: 'href is not supported on html.div',
    },
    {
      code: 'local/unsupported-child',
      message: 'html.div cannot be nested directly inside html.span',
    },
    {
      code: 'local/unsupported-target',
      message: 'html.video is not part of the Tamagui DOM contract',
    },
  ])
})

test('web and native DOM fixture bundles contain no semantic-reference runtime', async () => {
  const source = `
    import { html } from '@tamagui/core'
    export const Fixture = <html.main><html.span>content</html.span></html.main>
  `
  const [web, native] = await Promise.all([
    extractForWeb(source, {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }),
    extractForNative(source),
  ])

  expect(web?.diagnostics).toEqual([])
  expect(native.diagnostics).toEqual([])

  const [webInputs, nativeInputs] = await Promise.all([
    bundledInputs(web!.js, 'web'),
    bundledInputs(native.code, 'native'),
  ])
  expect(
    nativeInputs.some((file) => file.endsWith('/core/core/dist/esm/dom.native.js'))
  ).toBe(true)
  for (const inputs of [webInputs, nativeInputs]) {
    expect(
      inputs.filter(
        (file) =>
          file.includes('/node_modules/react-strict-dom/') ||
          file.includes('/node_modules/@stylexjs/')
      )
    ).toEqual([])
  }
})
