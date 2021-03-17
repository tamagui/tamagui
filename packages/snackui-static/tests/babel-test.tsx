import '@dish/react-test-env/browser'

import React from 'react'

import { extractBabel } from './lib/extract'
import { getTestElement, getTestElements } from './lib/testStyles'

const app = require('./spec/out/out-babel')

window['React'] = React

test('styles - 1. extracts to a div for simple views', async () => {
  const { style } = await getTestElement(app.Test1)
  expect(style.backgroundColor).toBe('rgb(255, 0, 0)')
  expect(style.borderTopLeftRadius).toBe('100px')
  expect(style.boxShadow).toBe('0px 0px 10px rgba(0,0,0,1.00)')
})

test('styles - 2. extracts className for complex views but keeps other props', async () => {
  const [truthy, falsy] = await getTestElements(app.Test2)
  expect(truthy.style.backgroundColor).toBe('rgb(255, 255, 255)')
  expect(truthy.style.top).toBe('-14px')
  expect(falsy.style.backgroundColor).toBe('rgb(0, 0, 0)')
  expect(falsy.style.top).toBe('0px')
})

test('styles - 6. spread ternary', async () => {
  const [truthy, falsy] = await getTestElements(app.Test6)
  expect(truthy.style.backgroundColor).toBe('rgb(0, 0, 255)')
  expect(falsy.style.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('styles - 11. all in one', async () => {
  const [truthy, falsy] = await getTestElements(app.Test11)
  expect(truthy.style.height).toBe('31px')
  expect(truthy.style.borderTopLeftRadius).toBe('8px')
  expect(truthy.style.borderTopColor).toBe('rgba(0,0,0,0.15)')
  expect(truthy.style['overflow-x']).toBe('hidden')
  expect(truthy.style.backgroundColor).toBe('rgb(0, 0, 255)')
  expect(falsy.style.height).toBe('0px')
  expect(falsy.style.borderTopLeftRadius).toBe('0px')
  expect(falsy.style.borderTopColor).toBe('rgba(0,0,0,0.15)')
  expect(falsy.style['overflow-x']).toBe('hidden')
  expect(falsy.style.backgroundColor).toBe('rgb(0, 0, 255)')
})

test('basic extraction', async () => {
  const output = extractBabel(`
    import { VStack } from 'snackui'
    export function Test() {
      return (
        <VStack backgroundColor="red" />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code.includes(`"backgroundColor": "red"`)).toBeTruthy()
})

test('basic conditional extraction', async () => {
  const output = extractBabel(`
    import { VStack } from 'snackui'
    export function Test() {
      return (
        <>
          <VStack backgroundColor={x ? 'red' : 'blue'} />
          <VStack {...x && { backgroundColor: 'red' }} />
        </>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(
    code.includes(`_sheet["0"], x ? _sheet["1"] : _sheet["2"]`)
  ).toBeTruthy()
  expect(
    code.includes(`_sheet["3"], x ? _sheet["4"] : _sheet["5"]`)
  ).toBeTruthy()
})
