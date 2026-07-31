import {
  ATTRIBUTES,
  EVENTS,
  NATIVE_BACKING,
  NATIVE_PRIMITIVE_MODULE,
  TAGS,
  type PropTags,
  type TagName,
} from '@tamagui/dom'
import {
  localBailout,
  type CandidateImport,
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

function replaceTarget(
  edits: SourceEdit[],
  element: MaterializedElement,
  content: string
) {
  edits.push({
    start: element.component.span.start,
    end: element.component.span.end,
    content,
    origin: element.component.span,
  })
  if (element.component.closingSpan) {
    edits.push({
      start: element.component.closingSpan.start,
      end: element.component.closingSpan.end,
      content,
      origin: element.component.closingSpan,
    })
  }
}

const versionHash = createHash('sha256')
  .update(
    JSON.stringify({
      ATTRIBUTES,
      EVENTS,
      NATIVE_BACKING,
      NATIVE_PRIMITIVE_MODULE,
      TAGS,
    })
  )
  .digest('hex')

export const domStructuralPass: StructuralModulePass = {
  versionHash: `dom-structural-v1-${versionHash}`,
  transform({ module, source, target }) {
    const edits: SourceEdit[] = []
    const imports: CandidateImport[] = []
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

    const usedPrimitives = new Set<string>()
    const primitiveLocals = new Map<string, string>()
    let reactCreateElement = ''
    if (target === 'native') {
      const primitives = new Set(
        supportedDOMElements.map(
          (element) => NATIVE_BACKING[TAGS[element.component.name].backing].primitive
        )
      )
      for (const element of supportedDOMElements) {
        const tag = TAGS[element.component.name]
        if (
          NATIVE_BACKING[tag.backing].wrapsLiteralText &&
          element.entries.some(
            (entry) =>
              entry.kind === 'child' &&
              entry.value.kind === 'static' &&
              entry.value.literalOrigin === true &&
              (typeof entry.value.value === 'string' ||
                typeof entry.value.value === 'number')
          )
        ) {
          primitives.add(NATIVE_BACKING.text.primitive)
          if (element.form !== 'jsx') reactCreateElement = '__TamaguiCreateElement'
        }
      }
      for (const primitive of primitives) {
        let local = `__Tamagui${primitive}`
        while (new RegExp(`\\b${local}\\b`).test(source)) local += '_'
        primitiveLocals.set(primitive, local)
      }
      if (reactCreateElement) {
        while (new RegExp(`\\b${reactCreateElement}\\b`).test(source)) {
          reactCreateElement += '_'
        }
      }
    }

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
              `${entry.name} is not supported on native html.${tagName}: ${row.note ?? 'no native equivalent'}`
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

      if (target === 'web') {
        const targetName = element.form === 'jsx' ? tagName : JSON.stringify(tagName)
        replaceTarget(edits, element, targetName)
        continue
      }

      const primitive = NATIVE_BACKING[tag.backing].primitive
      const localPrimitive = primitiveLocals.get(primitive)!
      usedPrimitives.add(primitive)
      replaceTarget(edits, element, localPrimitive)

      if (!NATIVE_BACKING[tag.backing].wrapsLiteralText) continue
      for (const entry of element.entries) {
        if (entry.kind !== 'child') continue
        if (
          entry.value.kind === 'empty' ||
          entry.value.kind === 'element' ||
          (entry.value.kind === 'static' &&
            (entry.value.value === null || typeof entry.value.value === 'boolean'))
        ) {
          continue
        }
        if (
          entry.value.kind !== 'static' ||
          entry.value.literalOrigin !== true ||
          (typeof entry.value.value !== 'string' && typeof entry.value.value !== 'number')
        ) {
          diagnostics.push(
            localBailout(
              'local/unsupported-child',
              entry.span,
              `html.${tagName} has a direct child that may render unwrapped native text; write a literal as JSX text or wrap the child in html.span`
            )
          )
          continue
        }
        const textPrimitive = NATIVE_BACKING.text.primitive
        const localText = primitiveLocals.get(textPrimitive)!
        usedPrimitives.add(textPrimitive)
        const childSource = source.slice(entry.span.start, entry.span.end)
        edits.push({
          start: entry.span.start,
          end: entry.span.end,
          content:
            element.form === 'jsx'
              ? `<${localText}>${childSource}</${localText}>`
              : `${reactCreateElement}(${localText}, null, ${childSource})`,
          origin: entry.span,
        })
      }
    }

    if (target === 'native' && usedPrimitives.size) {
      const specifiers = [...usedPrimitives]
        .sort()
        .map((primitive) => `${primitive} as ${primitiveLocals.get(primitive)}`)
        .join(', ')
      imports.push({
        content: `\nimport { ${specifiers} } from ${JSON.stringify(NATIVE_PRIMITIVE_MODULE)}\n`,
        origin: module.elements[0]?.span ?? {
          id: module.id,
          start: 0,
          end: Math.min(1, source.length),
        },
      })
      if (reactCreateElement) {
        imports.push({
          content: `\nimport { createElement as ${reactCreateElement} } from "react"\n`,
          origin: module.elements[0]?.span ?? {
            id: module.id,
            start: 0,
            end: Math.min(1, source.length),
          },
        })
      }
    }

    const domSpans = new Set(domElements.map((element) => element.span.start))
    const nextModule: MaterializedModule = {
      ...module,
      elements: module.elements.filter((element) => !domSpans.has(element.span.start)),
    }
    return {
      module: nextModule,
      edits,
      imports,
      diagnostics,
      dependencies: [],
    }
  },
}
