import { describe, expect, test } from 'vitest'

import {
  ARIA_ROLES,
  ATTRIBUTES,
  AUTO_COMPLETE_VALUES,
  NATIVE_INPUT_TYPES,
} from '../tables/attributes'
import { COMPATIBILITY, RSD_REFERENCE } from '../tables/compatibility'
import { EVENTS } from '../tables/events'
import { NATIVE_BACKING, NATIVE_ELEMENT_DEFAULTS } from '../tables/nativeBacking'
import { DISPLAY_WEB_RESET, TAGS, TAG_NAMES, TAG_WEB_DEFAULTS } from '../tables/tags'
import type { PropTags, TagName } from '../tables/types'
import snapshot from './rsd-snapshot.json'

/**
 * Conformance against the pinned React Strict DOM release.
 *
 * The snapshot is extracted from the RSD checkout by
 * `bun scripts/extract-rsd-snapshot.ts`, so these tests compare the tables
 * against RSD's own source rather than against a description of it. Every
 * difference has to be claimed by a row in `COMPATIBILITY`, and every row with
 * keys has to still describe a real difference, so neither the tables nor the
 * compatibility record can drift when the pin moves.
 */

/** the RSD props type each of our prop groups corresponds to */
const RSD_PROPS_TYPE: Readonly<Record<string, string>> = {
  common: 'StrictReactDOMProps',
  anchor: 'StrictReactDOMAnchorProps',
  button: 'StrictReactDOMButtonProps',
  image: 'StrictReactDOMImageProps',
  input: 'StrictReactDOMInputProps',
  label: 'StrictReactDOMLabelProps',
  listitem: 'StrictReactDOMListItemProps',
  optgroup: 'StrictReactDOMOptionGroupProps',
  option: 'StrictReactDOMOptionProps',
  select: 'StrictReactDOMSelectProps',
  textarea: 'StrictReactDOMTextAreaProps',
}

const rsdTags = snapshot.tags as Record<string, { backing: string; element: string; props: string }>
const rsdPropTypes = snapshot.propTypes as Record<string, string[]>
const rsdStyles = snapshot.styles as Record<string, Record<string, Record<string, unknown>>>

const accepts = (tags: PropTags, tag: TagName) => tags === '*' || tags.includes(tag)

const propsFor = (tag: TagName) => [
  ...Object.keys(ATTRIBUTES).filter((name) => accepts(ATTRIBUTES[name].tags, tag)),
  ...Object.keys(EVENTS).filter((name) => accepts(EVENTS[name].tags, tag)),
]

const symmetricDifference = (ours: Iterable<string>, theirs: Iterable<string>) => {
  const a = new Set(ours)
  const b = new Set(theirs)
  return [
    ...[...a].filter((key) => !b.has(key)),
    ...[...b].filter((key) => !a.has(key)),
  ]
}

const declaredKeys = (...areas: string[]) =>
  COMPATIBILITY.filter((row) => areas.includes(row.area)).flatMap((row) => row.keys)

/**
 * The differences the tables really have against the pin, and the ones
 * `COMPATIBILITY` claims, have to be the same set. An unclaimed difference is
 * undocumented drift; a claim with nothing behind it is a stale record.
 */
const expectExactlyDeclared = (live: string[], areas: string[]) => {
  expect([...new Set(live)].sort()).toEqual([...declaredKeys(...areas)].sort())
}

describe('the pinned reference', () => {
  test('matches the snapshot the tests compare against', () => {
    expect(RSD_REFERENCE).toEqual({
      version: snapshot.version,
      commit: snapshot.commit,
      date: snapshot.date,
    })
  })
})

describe('tags', () => {
  test('are exactly the elements react strict dom exposes', () => {
    expect([...TAG_NAMES].sort()).toEqual(Object.keys(rsdTags).sort())
  })

  test('lower to the same native primitive react strict dom uses', () => {
    for (const tag of TAG_NAMES) {
      expect(TAGS[tag].backing, tag).toBe(rsdTags[tag].backing)
    }
  })

  test('resolve refs to the same dom interface', () => {
    for (const tag of TAG_NAMES) {
      expect(TAGS[tag].element, tag).toBe(rsdTags[tag].element)
    }
  })

  test('use the prop group matching their strict props type', () => {
    for (const tag of TAG_NAMES) {
      expect(RSD_PROPS_TYPE[TAGS[tag].props], tag).toBe(rsdTags[tag].props)
    }
  })

  test('name only real tags as permitted children', () => {
    for (const tag of TAG_NAMES) {
      const { content, childTags } = TAGS[tag]
      expect(content === 'tags', `<${tag}> childTags`).toBe(childTags !== undefined)
      for (const child of childTags ?? []) expect(TAG_NAMES).toContain(child)
    }
  })
})

describe('the native backing table', () => {
  test('partitions the tags exactly as their backing column says', () => {
    for (const [backing, row] of Object.entries(NATIVE_BACKING)) {
      const expected = TAG_NAMES.filter((tag) => TAGS[tag].backing === backing)
      expect([...row.tags].sort(), backing).toEqual([...expected].sort())
    }
  })

  test('wraps literal text only where the host cannot render it', () => {
    for (const [backing, row] of Object.entries(NATIVE_BACKING)) {
      expect(row.wrapsLiteralText, backing).toBe(row.host === 'View')
    }
  })
})

describe('props and events', () => {
  test('are the surface react strict dom allows and declares', () => {
    const known = new Set([...Object.keys(ATTRIBUTES), ...Object.keys(EVENTS)])
    const differences = new Set<string>([
      ...snapshot.allowlist.filter((name) => !known.has(name)),
      // isPropAllowed lets any data- prefixed prop through without listing it
      ...[...known].filter(
        (name) => !snapshot.allowlist.includes(name) && !name.startsWith('data-')
      ),
    ])
    for (const tag of TAG_NAMES) {
      const declared = rsdPropTypes[RSD_PROPS_TYPE[TAGS[tag].props]]
      for (const key of symmetricDifference(propsFor(tag), declared)) differences.add(key)
    }
    expectExactlyDeclared([...differences], ['prop', 'event'])
  })

  test('are scoped to tags that exist', () => {
    for (const [name, row] of [...Object.entries(ATTRIBUTES), ...Object.entries(EVENTS)]) {
      if (row.tags === '*') continue
      for (const tag of row.tags) expect(TAG_NAMES, name).toContain(tag)
    }
  })

  test('name a native prop exactly when one carries the value', () => {
    for (const [name, row] of [...Object.entries(ATTRIBUTES), ...Object.entries(EVENTS)]) {
      // a polyfill may spread across several native props, so it names none
      if (row.native === 'none') expect(row.nativeProp, name).toBe(null)
      if (row.native === 'host') expect(row.nativeProp, name).not.toBe(null)
    }
  })
})

describe('value unions', () => {
  test('accept the same aria roles', () => {
    expect([...ARIA_ROLES].sort()).toEqual([...snapshot.unions.AriaRole].sort())
  })

  test('accept the same autofill hints', () => {
    expect([...AUTO_COMPLETE_VALUES].sort()).toEqual([...snapshot.unions.AutoComplete].sort())
  })

  test('render only input types html defines', () => {
    expect(
      NATIVE_INPUT_TYPES.filter((type) => !snapshot.unions.inputType.includes(type))
    ).toEqual([])
  })
})

describe('element default styles', () => {
  const webDefaults = (tag: TagName) => ({
    ...DISPLAY_WEB_RESET[TAGS[tag].display],
    ...TAGS[tag].defaults,
    ...TAG_WEB_DEFAULTS[tag],
  })

  const nativeDefaults = (tag: TagName) => ({
    ...NATIVE_ELEMENT_DEFAULTS,
    ...TAGS[tag].defaults,
    ...TAGS[tag].nativeDefaults,
  })

  const differencesOn = (platform: 'web' | 'native', ours: (tag: TagName) => object) =>
    TAG_NAMES.flatMap((tag) => {
      const mine = ours(tag) as Record<string, unknown>
      const theirs = rsdStyles[platform][tag]
      return symmetricDifference(Object.keys(mine), Object.keys(theirs))
        .concat(
          Object.keys(mine).filter(
            (key) => key in theirs && JSON.stringify(mine[key]) !== JSON.stringify(theirs[key])
          )
        )
        .map((key) => `${platform}.${tag}.${key}`)
    })

  test('match react strict dom on both platforms', () => {
    expectExactlyDeclared(
      [...differencesOn('web', webDefaults), ...differencesOn('native', nativeDefaults)],
      ['style']
    )
  })
})

describe('the compatibility record', () => {
  test('spells every key in a form the conformance tests can match', () => {
    for (const key of declaredKeys('style')) {
      const [platform, tag, property] = key.split('.')
      expect(key.split('.').length, key).toBe(3)
      expect(['web', 'native'], key).toContain(platform)
      expect(TAG_NAMES, key).toContain(tag)
      expect(property, key).toBeTruthy()
    }
    for (const key of declaredKeys('prop', 'event')) expect(key, key).not.toContain('.')
  })

  test('claims each key once, so the set comparison stays exact', () => {
    const keys = COMPATIBILITY.flatMap((row) => row.keys)
    expect(keys.filter((key, i) => keys.indexOf(key) !== i)).toEqual([])
  })
})
