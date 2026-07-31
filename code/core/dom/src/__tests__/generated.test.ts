import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, test } from 'vitest'

import { generateProps } from '../../scripts/generate-props'
import { ATTRIBUTES } from '../tables/attributes'
import { TAGS, TAG_NAMES } from '../tables/tags'

/**
 * `src/props.ts` is generated from the tables and checked in, so it can be read
 * and its declarations shipped without a build step. That only holds if the
 * checked-in copy is what the tables currently produce.
 */
describe('the generated prop interfaces', () => {
  test('are what the tables produce right now', () => {
    const checkedIn = readFileSync(join(import.meta.dirname, '..', 'props.ts'), 'utf8')
    expect(generateProps()).toBe(checkedIn)
  })

  test('have a type for every tag that accepts the prop', () => {
    for (const [name, row] of Object.entries(ATTRIBUTES)) {
      // the frontend supplies style, and children's type comes from the content model
      if (row.group === 'frontend' || name === 'children') continue
      const tags = row.tags === '*' ? TAG_NAMES : row.tags
      for (const tag of tags) {
        expect(row.perTag?.[tag]?.type ?? row.type, `${name} on <${tag}>`).toBeTruthy()
      }
    }
  })

  test('narrow a prop only on tags that accept it', () => {
    for (const [name, row] of Object.entries(ATTRIBUTES)) {
      for (const tag of Object.keys(row.perTag ?? {})) {
        expect(row.tags === '*' || row.tags.includes(tag as never), `${name} on <${tag}>`).toBe(
          true
        )
      }
    }
  })

  test('reject children on exactly the tags whose content model is void', () => {
    const noChildren = TAG_NAMES.filter((tag) => TAGS[tag].content === 'void')
    expect(noChildren).toEqual(['br', 'hr', 'img', 'input', 'textarea'])
  })
})
