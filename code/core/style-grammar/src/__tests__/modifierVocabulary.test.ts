import { describe, expect, test } from 'vitest'

import {
  compileModifierVocabulary,
  modifierKindMedia,
  modifierKindPlatform,
  modifierKindState,
  modifierKindTheme,
} from '../modifierVocabulary'
import { createModifierRegistry } from '../modifierRegistry'

describe('compiled modifier vocabulary', () => {
  test('uses numeric classification for exact entries and agrees with the parser', () => {
    const view = {
      mediaNames: ['sm', 'group-hover'],
      themeNames: ['dark', 'dark_blue', 'group-brand'],
    }
    const compiled = compileModifierVocabulary(view)
    const { registry } = createModifierRegistry(view)

    expect(compiled).toMatchObject({
      hover: modifierKindState,
      active: modifierKindState,
      sm: modifierKindMedia,
      web: modifierKindPlatform,
      dark: modifierKindTheme,
    })
    expect(compiled).not.toHaveProperty('dark_blue')
    expect(compiled).not.toHaveProperty('group-hover')
    expect(compiled).not.toHaveProperty('group-brand')

    for (const name of ['hover', 'active', 'sm', 'web', 'dark']) {
      expect(registry.get(name), name).toBeDefined()
    }
    expect(registry.get('group-hover')).toBe('group')
    expect(registry.get('group-brand')).toBeUndefined()
  })
})
