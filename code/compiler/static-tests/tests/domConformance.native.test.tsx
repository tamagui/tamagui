import * as React from 'react'
import { EVENTS, NATIVE_BACKING, TAGS, TAG_NAMES } from '@tamagui/dom'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

window['React'] = React

test('every supported semantic tag lowers to its declared primitive', async () => {
  const supported = TAG_NAMES.filter((tag) => TAGS[tag].native !== 'none')
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    export const App = () => <>${supported.map((tag) => `<html.${tag} />`).join('')}</>
  `)

  expect(output.diagnostics).toEqual([])
  for (const [backingName, backing] of Object.entries(NATIVE_BACKING)) {
    const expected = supported.filter((tag) => TAGS[tag].backing === backingName)
    const count =
      output.code.match(new RegExp(`<__Tamagui${backing.primitive}\\b`, 'g'))?.length ?? 0
    expect(count, backing.primitive).toBe(expected.length)
  }
})

test('native lowering applies defaults, authored styles, roles and prop mappings', async () => {
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    export const App = () => (
      <html.ol
        aria-busy
        aria-hidden
        aria-label="content"
        aria-valuenow={3}
        data-testid="root"
        hidden
        tabIndex={0}
        padding={8}
      />
    )
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('<__TamaguiDOMView')
  expect(output.code).toContain('"boxSizing":"content-box"')
  expect(output.code).toContain('"flexDirection":"column"')
  expect(output.code).toContain('"display":"none"')
  expect(output.code).toContain('"paddingTop":8')
  expect(output.code).toContain('accessibilityState={{ busy: true }}')
  expect(output.code).toContain('accessibilityValue={{ now: 3 }}')
  expect(output.code).toContain('accessibilityLabel="content"')
  expect(output.code).toContain('accessibilityElementsHidden={true}')
  expect(output.code).toContain(
    'importantForAccessibility={(true) ? "no-hide-descendants" : "auto"}'
  )
  expect(output.code).toContain('testID="root"')
  expect(output.code).toContain('focusable={(0) === 0}')
  expect(output.code).toContain('role={"list"}')
})

test('native text controls lower input semantics and standalone style handles', async () => {
  const output = await extractForNative(`
    import { html, style } from 'tamagui/dom'
    const field = style({ color: 'red', padding: 2 })
    export const App = () => (
      <>
        <html.input style={field} type="password" disabled />
        <html.textarea rows={4} readOnly />
      </>
    )
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('const field = undefined')
  expect(output.code).not.toContain('style({')
  expect(output.code).toContain('secureTextEntry={true}')
  expect(output.code).toContain('editable={!(true)}')
  expect(output.code).toContain('multiline={true}')
  expect(output.code).toContain('numberOfLines={4}')
  expect(output.code).toContain('"color":"red"')
  for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
    expect(output.code).toContain(`"padding${side}":2`)
  }
})

test('native inline, array and conditional handles become a React Native style array', async () => {
  const output = await extractForNative(`
    import { jsx } from 'react/jsx-runtime'
    import { html, style } from '@tamagui/core/dom'
    const base = style({ color: 'red' })
    declare const active: boolean
    export const App = jsx(html.span, {
      style: [base, active && style({ fontWeight: 'bold' })],
      children: 'hello',
    })
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('const base = undefined')
  expect(output.code).toContain('style: [')
  expect(output.code).toContain('(active) &&')
  expect(output.code).not.toContain('style({')
  expect(output.code).toContain('"color":"red"')
  expect(output.code).toContain('"fontWeight":"bold"')
})

test('native lowering rejects input types without a text-entry equivalent', async () => {
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    export const App = () => <html.input type="checkbox" />
  `)

  expect(output.diagnostics.map(({ code, message }) => ({ code, message }))).toEqual([
    {
      code: 'local/unsupported-target',
      message: 'input type checkbox has no native text-entry control',
    },
  ])
})

test('native lowering rejects a dynamic input type instead of silently dropping it', async () => {
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    declare const type: 'text' | 'password'
    export const App = () => <html.input type={type} />
  `)

  expect(output.diagnostics.map(({ code, message }) => ({ code, message }))).toEqual([
    {
      code: 'local/unsupported-target',
      message: 'html.input type must be statically known for native lowering',
    },
  ])
})

test('native style context clauses lower to the Tamagui runtime context path', async () => {
  const output = await extractForNative(`
    import { html, style } from 'tamagui/dom'
    const contextual = style({
      color: 'red dark:blue',
      opacity: '1 press:0.5',
      padding: '4 sm:8',
    })
    export const App = () => <html.span style={contextual} />
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('DOMRuntimeText as __TamaguiDOMRuntimeText')
  expect(output.code).toContain('<__TamaguiDOMRuntimeText')
  expect(output.code).toContain('__styles={[')
  expect(output.code).toContain('"color":"red dark:blue"')
  expect(output.code).toContain('"opacity":"1 press:0.5"')
  expect(output.code).toContain('"padding":"4 sm:8"')
  expect(output.code).toContain('const contextual = undefined')
})

test('native initial remains an explicit pinned-upstream limitation', async () => {
  const output = await extractForNative(`
    import { html, style } from 'tamagui/dom'
    const reset = style({ color: 'initial' })
    export const App = () => <html.span style={reset} />
  `)

  expect(output.diagnostics.map(({ code, message }) => ({ code, message }))).toEqual([
    {
      code: 'local/unsupported-target',
      message:
        'Native DOM style() does not support the CSS initial keyword, matching the pinned upstream limitation',
    },
  ])
})

test('literal text wrappers consume inherited styles in JSX and createElement', async () => {
  const output = await extractForNative(`
    import { createElement } from 'react'
    import { html } from '@tamagui/core'
    export const JSX = () => <html.div color="red">literal</html.div>
    export const Runtime = () => createElement(html.div, { color: 'red' }, 'literal')
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('<__TamaguiDOMText __inherit>literal</__TamaguiDOMText>')
  expect(output.code).toMatch(
    /__TamaguiCreateElement\d*\(__TamaguiDOMText\d*, \{ __inherit: true \}, 'literal'\)/
  )
})

test('every declared event either lowers or produces its documented native diagnostic', async () => {
  const entries = Object.entries(EVENTS).map(([name, row]) => {
    const tag = name === 'onKeyDown' ? 'input' : row.tags === '*' ? 'div' : row.tags[0]!
    return { name, row, tag }
  })
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    export const App = () => <>
      ${entries.map(({ name, tag }) => `<html.${tag} ${name}={() => {}} />`).join('\n')}
    </>
  `)
  const unsupported = entries.filter(({ row }) => row.native === 'none')

  expect(output.diagnostics).toHaveLength(unsupported.length)
  expect(
    output.diagnostics
      .map(({ blocking, message }) => ({ blocking, message }))
      .sort((left, right) => left.message.localeCompare(right.message))
  ).toEqual(
    unsupported
      .map(({ name }) => ({
        blocking: true,
        message: `${name} has no native DOM event equivalent`,
      }))
      .sort((left, right) => left.message.localeCompare(right.message))
  )
  for (const { name, row } of entries) {
    expect(output.code, name).toContain(name)
  }
})

test('dynamic hidden stays on the native runtime path', async () => {
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    declare const hidden: true | 'hidden' | 'until-found'
    export const App = () => <html.div hidden={hidden} />
  `)

  expect(
    output.diagnostics.map(({ blocking, message }) => ({ blocking, message }))
  ).toEqual([
    {
      blocking: true,
      message: 'html.div hidden must be statically known for native lowering',
    },
  ])
  expect(output.code).toContain('<html.div hidden={hidden}')
})
