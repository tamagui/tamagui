process.env.TAMAGUI_TARGET = 'web'

import { expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui } from '../web/src'
import { getConfigRevisionSnapshot } from '../web/src/helpers/grammarConfig'

test('config revisions are stable and content-derived', () => {
  const base = config.getDefaultTamaguiConfig()
  const current = createTamagui(base)
  const first = getConfigRevisionSnapshot(current)
  expect(getConfigRevisionSnapshot(current)).toEqual(first)

  const changed = createTamagui({
    ...base,
    tokens: {
      ...base.tokens,
      space: { ...base.tokens.space, brandNew: 123 },
    },
  })
  expect(getConfigRevisionSnapshot(changed).revision).not.toBe(first.revision)
})
