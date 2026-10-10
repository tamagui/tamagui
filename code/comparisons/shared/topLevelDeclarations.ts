import { parseSync, type Statement } from 'oxc-parser'

export type TopLevelDeclaration = {
  kind: 'function' | 'variable'
  name: string
  line: number
  start: number
  end: number
  replacementStart: number
  replacementEnd: number
  initializerType?: string
}

export function topLevelDeclarations(
  file: string,
  source: string
): TopLevelDeclaration[] {
  const parsed = parseSync(file, source, {
    lang: file.endsWith('x') ? 'jsx' : 'js',
    sourceType: 'unambiguous',
  })
  if (parsed.errors.length) {
    throw new Error(
      `could not parse ${file}:\n${parsed.errors
        .map((error) => error.codeframe || error.message)
        .join('\n')}`
    )
  }

  const line = (offset: number) => source.slice(0, offset).split('\n').length
  const declarations: TopLevelDeclaration[] = []
  for (const authored of parsed.program.body) {
    const statement =
      (authored.type === 'ExportNamedDeclaration' ||
        authored.type === 'ExportDefaultDeclaration') &&
      authored.declaration &&
      typeof authored.declaration !== 'string'
        ? (authored.declaration as Statement)
        : authored

    if (statement.type === 'FunctionDeclaration' && statement.id && statement.body) {
      declarations.push({
        kind: 'function',
        name: statement.id.name,
        line: line(statement.start),
        start: authored.start,
        end: authored.end,
        replacementStart: statement.body.start,
        replacementEnd: statement.body.end,
      })
      continue
    }
    if (statement.type !== 'VariableDeclaration') continue
    for (const declaration of statement.declarations) {
      if (declaration.id.type !== 'Identifier' || !declaration.init) continue
      declarations.push({
        kind: 'variable',
        name: declaration.id.name,
        line: line(statement.start),
        start: authored.start,
        end: authored.end,
        replacementStart: declaration.init.start,
        replacementEnd: declaration.init.end,
        initializerType: declaration.init.type,
      })
    }
  }
  return declarations
}
