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
// THE PROBE FILE MUST IMPORT THE APP'S TAMAGUI CONFIG. Token unions come from
// the `declare module 'tamagui' { interface TamaguiCustomConfig ... }`
// augmentation, so a probe that only imports components sees the unaugmented
// generic config and reports zero tokens for every prop. That looks exactly
// like the regression this script exists to catch, so the script detects it and
// exits 3 instead of 1:
//
//   import { View } from 'tamagui'
//   import '../tamagui.config'          // <- required, not optional
//   export const probe = <View bg="" backgroundColor="" />
//
// A tsconfig.json must exist at or above the probe file.
//
// Exit codes:
//   0  every inspected attribute carries theme token literals
//   1  token regression: contextual types resolved, but an attribute has none
//   2  usage error (bad args, no tsconfig, no matching attributes)
//   3  the probe is not in an augmented program, so the run proves nothing

import ts from 'typescript'
import { dirname, resolve } from 'node:path'
import { existsSync } from 'node:fs'

const [, , fileArg, attrArg, ...flags] = process.argv
if (!fileArg) {
  console.error(
    'usage: inspect-style-prop-types.mjs <file.tsx> [attr,attr] [--expect-tokens]'
  )
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

// Token unions only exist when the user's config is merged into
// `TamaguiCustomConfig`. Unaugmented, that interface has no members and every
// token type collapses to its generic fallback, which reads as "zero tokens" on
// every prop. Checking it directly is what separates a broken probe from a
// broken prop type.
function configAugmentation() {
  for (const sourceFile of program.getSourceFiles()) {
    let found = null
    const walk = (node) => {
      if (found) return
      if (ts.isInterfaceDeclaration(node) && node.name.text === 'TamaguiCustomConfig') {
        found = node
        return
      }
      ts.forEachChild(node, walk)
    }
    walk(sourceFile)
    if (!found) continue
    const symbol = checker.getSymbolAtLocation(found.name)
    if (!symbol) continue
    const members = checker.getPropertiesOfType(checker.getDeclaredTypeOfSymbol(symbol))
    return { found: true, memberCount: members.length }
  }
  return { found: false, memberCount: 0 }
}

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
    } else if (
      !(part.flags & (F.NumberLiteral | F.Number | F.Boolean | F.BooleanLiteral))
    ) {
      if (nonLiteral.length < 6) nonLiteral.push(checker.typeToString(part))
    }
  }
  return {
    constituents: parts.length,
    stringLiterals,
    tokenLiterals,
    templates,
    nonLiteral,
  }
}

const rows = []
function visit(node) {
  if (
    ts.isJsxAttribute(node) &&
    node.initializer &&
    ts.isStringLiteral(node.initializer)
  ) {
    const name = node.name.getText()
    if (!wanted || wanted.includes(name)) {
      const tag = node.parent.parent
      const contextual = checker.getContextualType(node.initializer)
      rows.push({
        tag: tag.tagName ? tag.tagName.getText() : '?',
        attr: name,
        contextual: !!contextual,
        ...(contextual
          ? describe(contextual)
          : {
              constituents: 0,
              stringLiterals: 0,
              tokenLiterals: 0,
              templates: 0,
              nonLiteral: [],
            }),
      })
    }
  }
  ts.forEachChild(node, visit)
}
visit(source)

if (!rows.length) {
  console.error(
    'no JSX string-literal attributes matched; give the probe file attributes like <View bg="" />'
  )
  process.exit(2)
}

for (const row of rows) {
  console.log(
    `${row.tag}.${row.attr}`.padEnd(28) +
      (row.contextual
        ? `constituents=${String(row.constituents).padStart(5)}  ` +
          `stringLiterals=${String(row.stringLiterals).padStart(5)}  ` +
          `tokens=${String(row.tokenLiterals).padStart(4)}  ` +
          `templates=${row.templates}`
        : 'no contextual type')
  )
  if (row.nonLiteral.length) console.log(`  other members: ${row.nonLiteral.join(' | ')}`)
}

const config = configAugmentation()
const noContextual = rows.filter((row) => !row.contextual)

// order matters: a broken probe must never be reported as a token regression,
// so both "not augmented" checks run before the token assertion
if (!config.found || config.memberCount === 0) {
  console.error(
    `\nPROBE NOT USABLE: this program has no tamagui config augmentation` +
      `${config.found ? ' (TamaguiCustomConfig is declared but empty)' : ' (TamaguiCustomConfig was not found)'}.` +
      `\nToken unions come from the config, so every prop reads as zero tokens here` +
      ` whether or not the prop types are correct. This run proves nothing.` +
      `\nAdd an import of the app's tamagui config to ${fileArg}, e.g. import '../tamagui.config'.`
  )
  process.exit(3)
}

if (noContextual.length) {
  console.error(
    `\nPROBE NOT USABLE: no contextual type for ` +
      `${noContextual.map((r) => `${r.tag}.${r.attr}`).join(', ')}.` +
      `\nThat attribute is not a prop of that component (or JSX is not configured` +
      ` in this tsconfig), so there is no union to inspect. This is a broken probe,` +
      ` not a token regression.`
  )
  process.exit(3)
}

if (expectTokens) {
  const empty = rows.filter((row) => row.tokenLiterals === 0)
  if (empty.length) {
    console.error(
      `\nFAIL: no theme token literals in ${empty.map((r) => `${r.tag}.${r.attr}`).join(', ')}, ` +
        `in a program whose config augmentation carries ${config.memberCount} members.` +
        `\nThe prop still typechecks because of (string & {}), but autocomplete is dead.`
    )
    process.exit(1)
  }
  console.log(
    `\nOK: every inspected attribute carries theme token literals ` +
      `(config augmentation: ${config.memberCount} members)`
  )
}
