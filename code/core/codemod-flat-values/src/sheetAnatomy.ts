// v3 splits `Sheet.Frame` into `Sheet.Container` (layout) and `Sheet.Background`
// (surface). Every Frame becomes a Container whose first child is a Background
// carrying the surface props, so a migrated sheet keeps the surface v2 gave it.

import {
  Node,
  SyntaxKind,
  type JsxAttribute,
  type JsxElement,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type SourceFile,
} from 'ts-morph'
import type { Flag } from './convert'
import type { createProvenance } from './provenance'

export interface SheetFrameReport {
  label: string
  line: number
  before: string
  after: string
  flags: Flag[]
}

const surfaceProps = new Set([
  'bg',
  'background',
  'backgroundColor',
  'backgroundImage',
  'borderColor',
  'borderRadius',
  'borderStyle',
  'borderWidth',
  'boxShadow',
  'disableHideBottomOverflow',
  'elevate',
  'elevation',
  'elevationAndroid',
  'outlineColor',
  'outlineOffset',
  'outlineStyle',
  'outlineWidth',
])

function isSurfaceProp(name: string): boolean {
  return (
    surfaceProps.has(name) ||
    /^border[A-Z].*(Color|Radius|Style|Width)$/.test(name) ||
    /^shadow[A-Z]/.test(name)
  )
}

interface Edit {
  start: number
  end: number
  text: string
}

function applyEdits(source: string, base: number, edits: readonly Edit[]): string {
  let text = source
  for (const edit of [...edits].sort((left, right) => right.start - left.start)) {
    text = `${text.slice(0, edit.start - base)}${edit.text}${text.slice(edit.end - base)}`
  }
  return text
}

/** `Sheet.Frame`, `Dialog.Sheet.Frame`: the sheet expression and the part name */
function sheetPart(node: Node): { sheet: string; part: Node; partName: string } | null {
  if (!Node.isPropertyAccessExpression(node)) return null
  const owner = node.getExpression()
  const ownerName = Node.isPropertyAccessExpression(owner)
    ? owner.getName()
    : Node.isIdentifier(owner)
      ? owner.getText()
      : null
  if (ownerName !== 'Sheet') return null
  return { sheet: owner.getText(), part: node.getNameNode(), partName: node.getName() }
}

function frameOpening(
  opening: JsxOpeningElement | JsxSelfClosingElement,
  provenance: ReturnType<typeof createProvenance>
): { sheet: string; part: Node } | null {
  const found = sheetPart(opening.getTagNameNode())
  if (!found || found.partName !== 'Frame') return null
  if (!provenance.isTamaguiElement(opening)) return null
  return found
}

function attributeName(attribute: JsxAttribute): string | null {
  const name = attribute.getNameNode()
  return Node.isIdentifier(name) ? name.getText() : null
}

function rewriteFrame(
  opening: JsxOpeningElement | JsxSelfClosingElement,
  sheet: string,
  part: Node
): { after: string; start: number; end: number; flags: Flag[] } {
  const element = Node.isJsxOpeningElement(opening)
    ? opening.getParentIfKindOrThrow(SyntaxKind.JsxElement)
    : opening
  const start = element.getStart()
  const end = element.getEnd()
  const source = element.getText()
  const edits: Edit[] = [
    { start: part.getStart(), end: part.getEnd(), text: 'Container' },
  ]
  const flags: Flag[] = []

  const moved: string[] = []
  let previousEnd = opening.getTagNameNode().getEnd()
  for (const attribute of opening.getAttributes()) {
    if (Node.isJsxSpreadAttribute(attribute)) {
      flags.push({
        code: 'sheet-frame-spread',
        detail: `${attribute.getText()} stays on ${sheet}.Container; move any surface props it carries onto ${sheet}.Background by hand`,
      })
    } else {
      const name = attributeName(attribute)
      if (name !== null && isSurfaceProp(name)) {
        moved.push(attribute.getText())
        edits.push({ start: previousEnd, end: attribute.getEnd(), text: '' })
      }
    }
    previousEnd = attribute.getEnd()
  }
  const background = `<${sheet}.Background${moved.length ? ` ${moved.join(' ')}` : ''} />`

  if (Node.isJsxSelfClosingElement(element)) {
    // `<Sheet.Frame />` closes over nothing, so the Background is its only child
    edits.push({
      start: element.getEnd() - 2,
      end: element.getEnd(),
      text: `>${background}</${sheet}.Container>`,
    })
    // a trailing space before `/>` would separate the last attribute from `>`
    const beforeClose = source.slice(0, -2)
    if (/\s$/.test(beforeClose)) {
      edits.push({
        start: element.getEnd() - 2 - (beforeClose.length - beforeClose.trimEnd().length),
        end: element.getEnd() - 2,
        text: '',
      })
    }
    return { after: applyEdits(source, start, edits), start, end, flags }
  }

  const closingPart = sheetPart(element.getClosingElement().getTagNameNode())
  if (closingPart) {
    edits.push({
      start: closingPart.part.getStart(),
      end: closingPart.part.getEnd(),
      text: 'Container',
    })
  }

  const firstChild = element
    .getJsxChildren()
    .find((child) => !Node.isJsxText(child) || child.getText().trim() !== '')
  const existing =
    firstChild &&
    (Node.isJsxElement(firstChild) || Node.isJsxSelfClosingElement(firstChild))
      ? sheetPart(
          (Node.isJsxElement(firstChild)
            ? firstChild.getOpeningElement()
            : firstChild
          ).getTagNameNode()
        )
      : null
  if (existing?.partName === 'Background') {
    if (moved.length) {
      const existingOpening = Node.isJsxElement(firstChild)
        ? firstChild.getOpeningElement()
        : (firstChild as JsxSelfClosingElement)
      const attributes = existingOpening.getAttributes()
      const anchor = attributes.length
        ? attributes[attributes.length - 1]!.getEnd()
        : existingOpening.getTagNameNode().getEnd()
      edits.push({ start: anchor, end: anchor, text: ` ${moved.join(' ')}` })
    }
    return { after: applyEdits(source, start, edits), start, end, flags }
  }

  // a Frame written one child per line gets the Background on its own line at
  // the children's indentation; an inline one stays inline
  const afterOpening = source.slice(opening.getEnd() - start)
  const childLine = /^(\r?\n[ \t]*)/.exec(afterOpening)
  edits.push({
    start: opening.getEnd(),
    end: opening.getEnd(),
    text: childLine ? `${childLine[1]}${background}` : background,
  })
  return { after: applyEdits(source, start, edits), start, end, flags }
}

/**
 * Rewrites every provable `Sheet.Frame` element in the file. In write mode the
 * source is edited in place, one element at a time: an edit forgets every node
 * in the file, so each round re-reads the file for the next Frame.
 */
export function convertSheetFrames(
  sourceFile: SourceFile,
  provenance: ReturnType<typeof createProvenance>,
  write: boolean
): SheetFrameReport[] {
  const reports: SheetFrameReport[] = []

  const openings = (): Array<{
    opening: JsxOpeningElement | JsxSelfClosingElement
    sheet: string
    part: Node
  }> =>
    [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ]
      .sort((left, right) => left.getStart() - right.getStart())
      .flatMap((opening) => {
        const found = frameOpening(opening, provenance)
        return found ? [{ opening, ...found }] : []
      })

  const record = (
    opening: JsxOpeningElement | JsxSelfClosingElement,
    sheet: string,
    part: Node
  ) => {
    const element = Node.isJsxOpeningElement(opening)
      ? opening.getParentIfKindOrThrow(SyntaxKind.JsxElement)
      : opening
    const before = element.getText()
    const rewritten = rewriteFrame(opening, sheet, part)
    reports.push({
      label: `<${sheet}.Frame>`,
      line: opening.getStartLineNumber(),
      before,
      after: rewritten.after,
      flags: rewritten.flags,
    })
    return rewritten
  }

  if (write) {
    for (let next = openings()[0]; next; next = openings()[0]) {
      const rewritten = record(next.opening, next.sheet, next.part)
      sourceFile.replaceText([rewritten.start, rewritten.end], rewritten.after)
    }
  } else {
    for (const next of openings()) record(next.opening, next.sheet, next.part)
  }

  for (const call of sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((call) => provenance.isTamaguiStyledCall(call))
    .sort((left, right) => right.getStart() - left.getStart())) {
    const target = call.getArguments()[0]
    const found = target ? sheetPart(target) : null
    if (!found || found.partName !== 'Frame') continue
    const before = target!.getText()
    reports.push({
      label: `styled(${before}, …)`,
      line: call.getStartLineNumber(),
      before,
      after: `${found.sheet}.Container`,
      flags: [
        {
          code: 'sheet-frame-styled',
          detail: `${before} is split into ${found.sheet}.Container and ${found.sheet}.Background; the styled target is now the Container, so move any surface styles in this config to a styled ${found.sheet}.Background`,
        },
      ],
    })
    if (write) found.part.replaceWithText('Container')
  }

  return reports.sort((left, right) => left.line - right.line)
}
