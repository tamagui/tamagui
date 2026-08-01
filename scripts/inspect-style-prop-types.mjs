#!/usr/bin/env node
// Inspects what a JSX style attribute's contextual type actually CONTAINS, by
// asking the TypeScript checker for its union constituents.
//
// Why this exists: style prop types end in `| (string & {})`, so every
// assignability test passes whether or not the token arm is present. When the
// token literals silently drop out of a prop's union the prop still typechecks
// and only autocomplete dies, which is how `bg` shipped with zero theme tokens
// (see plans/v3-static-types-feasibility.md). Constituent inspection is the
// only thing that sees it.
//
// Usage:
//   node scripts/inspect-style-prop-types.mjs <file.tsx> [attr,attr,...]
//   node scripts/inspect-style-prop-types.mjs <file.tsx> bg,color --expect-tokens
//
// The file needs string-literal attributes to inspect, e.g.
//   export const probe = <View bg="" backgroundColor="" />
// and a tsconfig.json somewhere at or above it. `--expect-tokens` exits 1 if any
// inspected attribute has no `$`-prefixed literal in its union, which is the
// shape a regression guard would assert.

import ts from 'typescript'
import { dirname, resolve } from 'node:path'
import { existsSync } from 'node:fs'

const [, , fileArg, attrArg, ...flags] = process.argv
if (!fileArg) {
  console.error('usage: inspect-style-prop-types.mjs <file.tsx> [attr,attr] [--expect-tokens]')
  process.exit(2)
}
const file = resolve(fileArg)
const wanted = attrArg && !attrArg.startsWith('--') ? attrArg.split(',') : null
const expectTokens = flags.includes('--expect-tokens') || attrArg === '--expect-tokens'

function findTsconfig(from) {
  let dir = dirname(from)
  for (;;) {
    const candidate = resolve(dir, 'tsconfig.json')
    if (existsSync(candidate)) return candidate
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

const configPath = findTsconfig(file)
if (!configPath) {
  console.error(`no tsconfig.json found at or above ${file}`)
  process.exit(2)
}
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  dirname(configPath)
)

const program = ts.createProgram([file], parsed.options)
const checker = program.getTypeChecker()
const source = program.getSourceFile(file)
if (!source) {
  console.error(`could not load ${file}`)
  process.exit(2)
}

const F = ts.TypeFlags

function describe(type) {
  const parts = type.isUnion() ? type.types : [type]
  let stringLiterals = 0
  let tokenLiterals = 0
  let templates = 0
  const nonLiteral = []
  for (const part of parts) {
    if (part.flags & F.StringLiteral) {
      stringLiterals++
      if (String(part.value).startsWith('$')) tokenLiterals++
    } else if (part.flags & F.TemplateLiteral) {
      templates++
    } else if (!(part.flags & (F.NumberLiteral | F.Number | F.Boolean | F.BooleanLiteral))) {
      if (nonLiteral.length < 6) nonLiteral.push(checker.typeToString(part))
    }
  }
  return { constituents: parts.length, stringLiterals, tokenLiterals, templates, nonLiteral }
}

const rows = []
function visit(node) {
  if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
    const name = node.name.getText()
    if (!wanted || wanted.includes(name)) {
      const tag = node.parent.parent
      const contextual = checker.getContextualType(node.initializer)
      rows.push({
        tag: tag.tagName ? tag.tagName.getText() : '?',
        attr: name,
        ...(contextual
          ? describe(contextual)
          : { constituents: 0, stringLiterals: 0, tokenLiterals: 0, templates: 0, nonLiteral: ['(no contextual type)'] }),
      })
    }
  }
  ts.forEachChild(node, visit)
}
visit(source)

if (!rows.length) {
  console.error('no JSX string-literal attributes matched; give the probe file attributes like <View bg="" />')
  process.exit(2)
}

for (const row of rows) {
  console.log(
    `${row.tag}.${row.attr}`.padEnd(28) +
      `constituents=${String(row.constituents).padStart(5)}  ` +
      `stringLiterals=${String(row.stringLiterals).padStart(5)}  ` +
      `tokens=${String(row.tokenLiterals).padStart(4)}  ` +
      `templates=${row.templates}`
  )
  if (row.nonLiteral.length) console.log(`  other members: ${row.nonLiteral.join(' | ')}`)
}

if (expectTokens) {
  const empty = rows.filter((row) => row.tokenLiterals === 0)
  if (empty.length) {
    console.error(
      `\nFAIL: no theme token literals in ${empty.map((r) => `${r.tag}.${r.attr}`).join(', ')}. ` +
        `The prop still typechecks because of (string & {}), but autocomplete is dead.`
    )
    process.exit(1)
  }
  console.log('\nOK: every inspected attribute carries theme token literals')
}
