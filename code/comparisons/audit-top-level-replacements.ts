#!/usr/bin/env bun

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import ts from 'typescript'

const args = process.argv.slice(2)
const modulePath = args.find((arg) => arg.startsWith('--module='))?.slice(9)
const suffix = args.find((arg) => arg.startsWith('--suffix='))?.slice(9)
const bench = args.find((arg) => arg.startsWith('--bench='))?.slice(8)
const outDir = '/tmp/tamagui-top-level-replacement-audit'

if (!modulePath || !suffix || !bench) {
  console.error(
    'usage: audit-top-level-replacements.ts --module=<dist file> --suffix=<module suffix> --bench=<bench directory>'
  )
  process.exit(1)
}

const source = readFileSync(modulePath, 'utf8')
const sourceFile = ts.createSourceFile(
  modulePath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.JS
)
const declarations: Array<{ kind: 'function' | 'variable'; line: number; name: string }> =
  []

for (const statement of sourceFile.statements) {
  if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) {
    declarations.push({
      kind: 'function',
      line:
        sourceFile.getLineAndCharacterOfPosition(statement.getStart(sourceFile)).line + 1,
      name: statement.name.text,
    })
    continue
  }
  if (!ts.isVariableStatement(statement)) continue
  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue
    if (
      !ts.isArrowFunction(declaration.initializer) &&
      !ts.isFunctionExpression(declaration.initializer) &&
      !ts.isObjectLiteralExpression(declaration.initializer) &&
      !ts.isArrayLiteralExpression(declaration.initializer) &&
      !ts.isNewExpression(declaration.initializer) &&
      !ts.isCallExpression(declaration.initializer)
    ) {
      continue
    }
    declarations.push({
      kind: 'variable',
      line:
        sourceFile.getLineAndCharacterOfPosition(statement.getStart(sourceFile)).line + 1,
      name: declaration.name.text,
    })
  }
}

function build(replacement?: string) {
  const result = Bun.spawnSync(
    [
      'bunx',
      'vite',
      'build',
      '--mode',
      'baseline-styled-view',
      '--outDir',
      outDir,
      '--emptyOutDir',
      '--logLevel',
      'silent',
    ],
    {
      cwd: bench,
      env: {
        ...process.env,
        VITE_CONFIG_NATIVE_IGNORE_WARNING: 'true',
        ...(replacement ? { BUNDLE_AUDIT_REPLACE: replacement } : {}),
      },
      stdout: 'pipe',
      stderr: 'pipe',
    }
  )
  if (result.exitCode !== 0) {
    throw new Error(
      `${replacement || 'control'} failed:\n${result.stdout.toString()}\n${result.stderr.toString()}`
    )
  }
  const file = readdirSync(join(outDir, 'assets')).find((name) => name.endsWith('.js'))
  if (!file) throw new Error(`${replacement || 'control'} emitted no JavaScript chunk`)
  const code = readFileSync(join(outDir, 'assets', file))
  return { raw: code.byteLength, gzip: gzipSync(code, { level: 9 }).byteLength }
}

const control = build()
const rows = []
for (const declaration of declarations) {
  const measured = build(`${suffix}:${declaration.name}`)
  rows.push({
    ...declaration,
    raw: measured.raw,
    gzip: measured.gzip,
    rawSaving: control.raw - measured.raw,
    gzipSaving: control.gzip - measured.gzip,
  })
}
rows.sort((a, b) => b.gzipSaving - a.gzipSaving)

console.info(`control raw=${control.raw} gzip=${control.gzip}`)
console.info('gzipSave  rawSave  rawAfter gzipAfter  line kind      declaration')
for (const row of rows) {
  console.info(
    `${String(row.gzipSaving).padStart(8)} ${String(row.rawSaving).padStart(8)} ${String(row.raw).padStart(8)} ${String(row.gzip).padStart(9)} ${String(row.line).padStart(5)} ${row.kind.padEnd(9)} ${row.name}`
  )
}
