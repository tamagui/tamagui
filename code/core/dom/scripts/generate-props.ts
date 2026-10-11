/**
 * Generates src/props.ts, the strict DOM prop interfaces, from the tables.
 *
 *   bun scripts/generate-props.ts
 *
 * The output is checked in and a test regenerates it to prove it is current, so
 * editing src/props.ts by hand fails rather than drifts. Interfaces extending
 * one base interface are the cheapest shape TypeScript has: no mapped types, no
 * conditional types, and nothing pulls React's whole `HTMLAttributes` in.
 */

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { format } from './format'

import {
  ARIA_ROLES,
  ATTRIBUTES,
  AUTO_COMPLETE_VALUES,
  HTML_INPUT_TYPES,
} from '../src/tables/attributes'
import { EVENTS } from '../src/tables/events'
import { TAGS, TAG_NAMES } from '../src/tables/tags'
import type { AttributeRow, EventRow, PropsGroup, TagName } from '../src/tables/types'

/** the interface each prop group becomes */
const INTERFACE: Readonly<Record<PropsGroup, string>> = {
  common: 'StrictDOMProps',
  anchor: 'StrictDOMAnchorProps',
  button: 'StrictDOMButtonProps',
  image: 'StrictDOMImageProps',
  input: 'StrictDOMInputProps',
  label: 'StrictDOMLabelProps',
  listitem: 'StrictDOMListItemProps',
  optgroup: 'StrictDOMOptionGroupProps',
  option: 'StrictDOMOptionProps',
  select: 'StrictDOMSelectProps',
  textarea: 'StrictDOMTextAreaProps',
}

const BASE = 'StrictDOMPropsBase'
/** the void variant of the common interface, for br and hr */
const VOID = 'StrictDOMVoidProps'

const scoped = (tags: AttributeRow['tags']) => tags !== '*'

/** what a tag's content model allows as children */
const childrenType = (tag: TagName) => {
  const { content } = TAGS[tag]
  if (content === 'void') return 'never'
  if (content === 'text') return 'string | number'
  return 'ReactNode'
}

const quoted = (name: string) => (/^[A-Za-z_$][\w$]*$/.test(name) ? name : `'${name}'`)

const union = (values: readonly string[]) =>
  values.map((value) => `  | '${value}'`).join('\n')

const doc = (row: AttributeRow | EventRow, note: string | undefined) => {
  const lines: string[] = []
  if (note) lines.push(note)
  // only the props native cannot do at all get a platform tag: a polyfilled prop
  // works on both, and tagging forty of those would say nothing and cost
  // declaration size
  if (row.native === 'none') lines.push('@platform web')
  if (lines.length === 0) return ''
  if (lines.length === 1) return `  /** ${lines[0]} */\n`
  return `  /**\n${lines.map((line) => `   * ${line}`).join('\n')}\n   */\n`
}

const member = (
  name: string,
  type: string,
  row: AttributeRow | EventRow,
  note: string | undefined
) => `${doc(row, note)}  ${quoted(name)}?: ${type}`

const attributeMembers = (names: string[], tag: TagName) =>
  names.map((name) => {
    const row = ATTRIBUTES[name]
    const override = row.perTag?.[tag]
    const type = override?.type ?? row.type
    if (!type) throw new Error(`no type for ${name} on <${tag}>`)
    return member(name, type, row, override?.note ?? row.note)
  })

const eventMembers = (names: string[]) =>
  names.map((name) =>
    member(
      name,
      `(event: ${EVENTS[name].payload}) => void`,
      EVENTS[name],
      EVENTS[name].note
    )
  )

export function generateProps(): string {
  return format(propsSource(), 'props.ts')
}

function propsSource(): string {
  // the base carries everything every tag accepts, so each element interface is
  // one `extends` away from the whole shared surface
  const shared = Object.keys(ATTRIBUTES).filter(
    (name) =>
      !scoped(ATTRIBUTES[name].tags) &&
      // the styling frontend supplies style, the index signature covers data-*,
      // and children's type comes from the tag's content model, not from its row
      ATTRIBUTES[name].group !== 'frontend' &&
      name !== 'data-*' &&
      name !== 'children'
  )
  const sharedEvents = Object.keys(EVENTS).filter((name) => !scoped(EVENTS[name].tags))

  // each group is the props of any one of its tags; assert they really agree
  const tagsByGroup = new Map<PropsGroup, TagName[]>()
  for (const tag of TAG_NAMES) {
    const group = TAGS[tag].props
    tagsByGroup.set(group, [...(tagsByGroup.get(group) ?? []), tag])
  }

  const scopedFor = (tag: TagName) => ({
    attributes: Object.keys(ATTRIBUTES)
      .filter(
        (name) => scoped(ATTRIBUTES[name].tags) && ATTRIBUTES[name].tags.includes(tag)
      )
      .sort(),
    events: Object.keys(EVENTS)
      .filter((name) => scoped(EVENTS[name].tags) && EVENTS[name].tags.includes(tag))
      .sort(),
  })

  const interfaces: string[] = []
  for (const [group, tags] of tagsByGroup) {
    const signature = (tag: TagName) => JSON.stringify(scopedFor(tag))
    const disagreeing = tags.find((tag) => signature(tag) !== signature(tags[0]))
    if (disagreeing) {
      throw new Error(
        `<${disagreeing}> and <${tags[0]}> share the ${group} prop group but not their props`
      )
    }

    const { attributes, events } = scopedFor(tags[0])
    const children = [...new Set(tags.map(childrenType))]
    // only the common group spans tags with different content models
    if (group !== 'common' && children.length > 1) {
      throw new Error(`the ${group} prop group spans ${children.length} content models`)
    }
    if (
      group === 'common' &&
      JSON.stringify(children.sort()) !== '["ReactNode","never"]'
    ) {
      throw new Error(`the common prop group no longer spans exactly ReactNode and never`)
    }

    const body = (childrenSource: string) =>
      [
        ...attributeMembers(attributes, tags[0]),
        ...eventMembers(events),
        `  children?: ${childrenSource}`,
      ].join('\n')

    if (group === 'common') {
      const voidTags = tags.filter((tag) => childrenType(tag) === 'never')
      interfaces.push(
        `export interface ${INTERFACE.common} extends ${BASE} {\n${body('ReactNode')}\n}`,
        `/** the common interface for a tag that takes no children: ${voidTags.join(' and ')} */\n` +
          `export interface ${VOID} extends ${BASE} {\n${body('never')}\n}`
      )
    } else {
      interfaces.push(
        `export interface ${INTERFACE[group]} extends ${BASE} {\n${body(children[0])}\n}`
      )
    }
  }

  const interfaceFor = (tag: TagName) =>
    TAGS[tag].props === 'common' && TAGS[tag].content === 'void'
      ? VOID
      : INTERFACE[TAGS[tag].props]

  const byTag = TAG_NAMES.map((tag) => `  ${tag}: ${interfaceFor(tag)}`).join('\n')

  const payloads = [...new Set(Object.values(EVENTS).map((row) => row.payload))]
    .filter((payload) => payload !== 'unknown')
    .sort()

  return `${[
    '// Generated by scripts/generate-props.ts from the tables in src/tables.',
    '// Run `bun run generate:props` after changing a table. Do not edit by hand.',
    '',
    `import type { ReactNode } from 'react'`,
    '',
    `import type {\n${payloads.map((name) => `  ${name},`).join('\n')}\n} from './events'`,
    '',
    '/** the aria roles an author may set, excluding the abstract roles */',
    `export type AriaRole =\n${union(ARIA_ROLES)}`,
    '',
    '/** the autofill hints web and react native both understand */',
    `export type AutoComplete =\n${union(AUTO_COMPLETE_VALUES)}`,
    '',
    '/** every html input type; the ones native cannot render are a native build error */',
    `export type InputType =\n${union(HTML_INPUT_TYPES)}`,
    '',
    '/**',
    ' * `data-*` passthrough. Only `data-testid` reaches native, as `testID`; the',
    ' * rest are web attributes.',
    ' */',
    'export interface StrictDOMDataProps {',
    '  [key: `data-${string}`]: string | number | boolean | undefined',
    '}',
    '',
    '/**',
    ' * Everything every tag accepts. Element interfaces extend this rather than',
    ' * restating it, so a tag costs one interface to instantiate.',
    ' */',
    `export interface ${BASE} extends StrictDOMDataProps {`,
    [...attributeMembers(shared, 'div'), ...eventMembers(sharedEvents)].join('\n'),
    '}',
    '',
    interfaces.join('\n\n'),
    '',
    '/** the props interface for each tag in the DOM contract */',
    `export type StrictDOMPropsByTag = {\n${byTag}\n}`,
    '',
  ].join('\n')}`
}

if (import.meta.main) {
  const out = join(import.meta.dirname, '..', 'src', 'props.ts')
  writeFileSync(out, generateProps())
  console.info(`generated src/props.ts for ${TAG_NAMES.length} tags`)
}
