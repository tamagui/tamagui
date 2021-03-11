import '@dish/react-test-env/browser'

import React from 'react'

import { extractBabel } from './lib/extract'
import { testStyles } from './lib/testStyles'

const app = require('./spec/out/out-babel')

window['React'] = React

beforeAll(async () => {
  testStyles(test, app)
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
  console.log('code', code)
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
