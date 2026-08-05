import {
  ATTRIBUTES,
  EVENTS,
  NATIVE_BACKING,
  TAGS,
  type PropTags,
  type TagName,
} from '@tamagui/dom'
import {
  localBailout,
  type BailoutReason,
  type MaterializedElement,
  type MaterializedModule,
  type SourceEdit,
  type StructuralModulePass,
} from '@tamagui/compiler-core'
import { createHash } from 'node:crypto'

const DOM_FRONTENDS = new Set([
  'tamagui',
  'tamagui/dom',
  '@tamagui/core',
  '@tamagui/core/dom',
  '@tamagui/tailwind',
])

const acceptsTag = (accepted: PropTags, tag: TagName) =>
  accepted === '*' || accepted.includes(tag)

function isDOMElement(element: MaterializedElement) {
  const provenance = element.component.provenance
  return provenance?.importedName === 'html' && DOM_FRONTENDS.has(provenance.specifier)
}

const versionHash = createHash('sha256')
  .update(
    JSON.stringify({
      ATTRIBUTES,
      EVENTS,
      NATIVE_BACKING,
      TAGS,
    })
  )
  .digest('hex')

export const domStructuralPass: StructuralModulePass = {
  versionHash: `dom-structural-v3-${versionHash}`,
  transform({ module, source, target }) {
    const edits: SourceEdit[] = []
    const diagnostics: BailoutReason[] = []
    const domElements = module.elements.filter(isDOMElement)
    const supportedDOMElements = domElements.filter(
      (
        element
      ): element is MaterializedElement & {
        component: MaterializedElement['component'] & { name: TagName }
      } => Object.hasOwn(TAGS, element.component.name)
    )
    const domBySpan = new Map(
      supportedDOMElements.map((element) => [
        `${element.span.start}:${element.span.end}`,
        element,
      ])
    )

    for (const element of domElements) {
      const tagName = element.component.name as TagName
      if (!Object.hasOwn(TAGS, tagName)) {
        diagnostics.push(
          localBailout(
            'local/unsupported-target',
            element.component.span,
            `html.${element.component.name} is not part of the Tamagui DOM contract`
          )
        )
        continue
      }
      const tag = TAGS[tagName]
      if (target === 'native' && tag.native === 'none') {
        diagnostics.push(
          localBailout(
            'local/unsupported-target',
            element.component.span,
            `html.${tagName} is not supported on native: ${tag.note ?? 'no native backing'}`
          )
        )
        continue
      }

      for (const entry of element.entries) {
        if (entry.kind !== 'prop') continue
        const attribute =
          (Object.hasOwn(ATTRIBUTES, entry.name) ? ATTRIBUTES[entry.name] : undefined) ??
          (entry.name.startsWith('data-') ? ATTRIBUTES['data-*'] : undefined)
        const event = Object.hasOwn(EVENTS, entry.name) ? EVENTS[entry.name] : undefined
        const row = attribute ?? event
        if (!row) continue
        if (!acceptsTag(row.tags, tagName)) {
          diagnostics.push(
            localBailout(
              'local/unsupported-prop-key',
              entry.span,
              `${entry.name} is not supported on html.${tagName}`
            )
          )
          continue
        }
        if (target === 'native' && row.native === 'none') {
          diagnostics.push(
            localBailout(
              'local/unsupported-prop-key',
              entry.span,
              event
                ? `${entry.name} has no native DOM event equivalent`
                : `${entry.name} is not supported on native html.${tagName}: ${row.note ?? 'no native equivalent'}`
            )
          )
        }
      }

      for (const entry of element.entries) {
        if (entry.kind !== 'child' || entry.value.kind !== 'element') continue
        const child = domBySpan.get(`${entry.value.span.start}:${entry.value.span.end}`)
        if (!child) continue
        const childTag = child.component.name
        const invalid =
          tag.content === 'void' ||
          tag.content === 'text' ||
          (tag.content === 'phrasing' && TAGS[childTag].display === 'block') ||
          (tag.content === 'tags' && !tag.childTags?.includes(childTag))
        if (invalid) {
          diagnostics.push(
            localBailout(
              'local/unsupported-child',
              child.component.span,
              `html.${childTag} cannot be nested directly inside html.${tagName}`
            )
          )
        }
      }
    }

    for (const definition of module.domStyleDefinitions) {
      if (definition.value.kind !== 'static') {
        diagnostics.push(
          localBailout(
            'local/dynamic-style-value',
            definition.value.span,
            `style() definition ${definition.name} must be statically evaluable`
          )
        )
        continue
      }
      edits.push({
        start: definition.span.start,
        end: definition.span.end,
        content: 'undefined',
        origin: definition.span,
      })
    }

    const nextModule: MaterializedModule = module
    return {
      module: nextModule,
      edits,
      imports: [],
      diagnostics,
      dependencies: [],
    }
  },
}
