import path from 'path'

import { TestRenderer } from '@o/react-test-env'
import anyTest, { TestInterface } from 'ava'

export const specDir = path.join(__dirname, '..', 'spec')
export const outDir = path.join(specDir, 'out')

type TestApp = {
  renderer: TestRenderer.ReactTestRenderer
  rendererFalse: TestRenderer.ReactTestRenderer
  Element: any
}

export const test = anyTest as TestInterface<{
  test1: TestApp
  test2: TestApp
  test3: TestApp
  test4: TestApp
  test5: TestApp
  test6: TestApp
  test7: TestApp
  test8: TestApp
  test9: TestApp
  test10: TestApp
  test11: TestApp
  test12: TestApp
  test13: TestApp
  test14: TestApp
  test15: TestApp
  test16: TestApp
  app: any
}>
