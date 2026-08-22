import { expect, test } from 'vitest'
import { noteOnce } from '../web/src/helpers/noteOnce'

test('dedupes exact messages until the bounded cache clears', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const first = '[tamagui] noteOnce bounded-cache first message'
    noteOnce(first)
    noteOnce(first)
    for (let index = 0; index < 1002; index++) {
      noteOnce(`[tamagui] noteOnce bounded-cache message ${index}`)
    }
    noteOnce(first)
    expect(warnings.filter((warning) => warning === first)).toHaveLength(2)
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})
