#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { resolveTamaguiHost } from '@tamagui/language-service/host'
import { stylePropsTextOnly } from '@tamagui/helpers'
import {
  ModuleKind,
  ModuleResolutionKind,
  Node,
  Project,
  ScriptTarget,
  SyntaxKind,
  ts,
  type Expression,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'ts-morph'
import { planContainers, type ContainerPlan } from './containers'
import { convertJsxSite, convertStyleObject, type SiteReport } from './convert'
import { compact, unwrapExpression } from './expressions'
import {
  codemodMediaNames,
  createModifierRegistry,
  grammarPlatformNames,
  type ConversionTargets,
  type HostView,
  type ModifierRegistryView,
} from './grammar'
import { createProvenance } from './provenance'
import { renderReport, type FileReport } from './report'

type Provenance = ReturnType<typeof createProvenance>

// every path is resolved against the directory the codemod is invoked from, so it
// migrates the project you are standing in whether that is an app or this repo
const projectRoot = process.cwd()
const defaultReportPath = resolve(projectRoot, 'tamagui-flat-values-report.md')
const ignoreMarker = '.tamagui-flat-values-ignore'
const ignoredDirectories = new Map<string, boolean>()

function isIgnored(filePath: string): boolean {
  let directory = dirname(filePath)
  const visited: string[] = []
  while (
    directory === projectRoot ||
    !relative(projectRoot, directory).startsWith('..')
  ) {
    const cached = ignoredDirectories.get(directory)
    if (cached !== undefined) {
      for (const seen of visited) ignoredDirectories.set(seen, cached)
      return cached
    }
    visited.push(directory)
    if (existsSync(resolve(directory, ignoreMarker))) {
      for (const seen of visited) ignoredDirectories.set(seen, true)
      return true
    }
    if (directory === projectRoot) break
    const parent = dirname(directory)
    if (parent === directory) break
    directory = parent
  }
  for (const seen of visited) ignoredDirectories.set(seen, false)
  return false
}

function collectFiles(inputs: readonly string[]): {
  sourceFiles: SourceFile[]
  ignoredFiles: number
} {
  // the checker is what proves a JSX tag resolves to a Tamagui component, so a
  // project whose tsconfig cannot be read would silently convert nothing
  const tsConfigFilePath = resolve(projectRoot, 'tsconfig.json')
  if (!existsSync(tsConfigFilePath)) {
    console.error(
      `no tsconfig.json in ${projectRoot}; run the codemod from your project root`
    )
    process.exit(2)
  }
  const project = new Project({
    tsConfigFilePath,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: false,
      jsx: 4,
      target: ScriptTarget.ES2020,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      strictNullChecks: true,
      baseUrl: projectRoot,
    },
  })

  const files = new Map<string, SourceFile>()
  const ignored = new Set<string>()
  const missing: string[] = []
  for (const input of inputs) {
    const path = resolve(projectRoot, input)
    if (!existsSync(path)) {
      missing.push(input)
      continue
    }
    const pattern = /\.[cm]?[jt]sx?$/.test(path) ? path : `${path}/**/*.{ts,tsx}`
    const matched = project.addSourceFilesAtPaths(pattern)
    // an input that matches nothing must never reach the report: a typo in a
    // migration path would otherwise render an empty corpus as ready to cut over
    if (!matched.length) missing.push(input)
    for (const file of matched) {
      const filePath = file.getFilePath()
      if (isIgnored(filePath)) ignored.add(filePath)
      else files.set(filePath, file)
    }
  }

  if (missing.length) {
    console.error(
      `no source file matched ${missing.map((input) => `"${input}"`).join(', ')}`
    )
    process.exit(2)
  }

  if (files.size === 0 && ignored.size > 0) {
    console.error(
      `all ${ignored.size} matched source ${ignored.size === 1 ? 'file was' : 'files were'} skipped by ${ignoreMarker}; no migration report was written`
    )
    process.exit(2)
  }

  return {
    sourceFiles: [...files.values()].sort((left, right) =>
      left.getFilePath().localeCompare(right.getFilePath())
    ),
    ignoredFiles: ignored.size,
  }
}

/** every `$theme-*` spelling the corpus uses, so its themes resolve as modifiers */
function themeNames(sourceFiles: readonly SourceFile[]): Set<string> {
  const names = new Set(['light', 'dark'])
  for (const sourceFile of sourceFiles) {
    for (const name of conditionNames(sourceFile)) {
      if (name.startsWith('$theme-')) names.add(name.slice('$theme-'.length))
    }
  }
  return names
}

/**
 * Configs may name media queries freely. Any otherwise-unreserved `$name`
 * condition in the migration corpus is therefore a media name; the codemod
 * must not require each app's config to be imported and executed.
 */
function mediaNames(sourceFiles: readonly SourceFile[]): Set<string> {
  const names = new Set(codemodMediaNames)
  for (const sourceFile of sourceFiles) {
    for (const name of conditionNames(sourceFile)) {
      if (!name.startsWith('$')) continue
      if (
        name.startsWith('$theme-') ||
        name.startsWith('$platform-') ||
        name.startsWith('$group-') ||
        grammarPlatformNames.has(name.slice(1))
      ) {
        continue
      }
      names.add(name.slice(1))
    }
  }
  return names
}

function conditionNames(sourceFile: SourceFile): string[] {
  const names: string[] = []
  for (const attribute of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
    const name = attribute.getNameNode()
    if (Node.isIdentifier(name)) names.push(name.getText())
  }
  for (const property of sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment)) {
    const name = property.getNameNode()
    if (Node.isComputedPropertyName(name)) continue
    names.push(name.getText().replace(/^['"]|['"]$/g, ''))
  }
  return names
}

/** every style object a variant value can be: one literal, or one per return */
function variantStyleObjects(value: Expression): ObjectLiteralExpression[] {
  const current = unwrapExpression(value)
  if (Node.isObjectLiteralExpression(current)) return [current]
  if (Node.isConditionalExpression(current)) {
    return [
      ...variantStyleObjects(current.getWhenTrue()),
      ...variantStyleObjects(current.getWhenFalse()),
    ]
  }
  if (Node.isArrowFunction(current) || Node.isFunctionExpression(current)) {
    const body = current.getBody()
    if (Node.isBlock(body)) {
      return body
        .getDescendantsOfKind(SyntaxKind.ReturnStatement)
        .flatMap((statement) => {
          const returned = statement.getExpression()
          return returned ? variantStyleObjects(returned) : []
        })
    }
    return variantStyleObjects(body as Expression)
  }
  return []
}

function variantSites(
  config: ObjectLiteralExpression,
  label: string,
  registry: ModifierRegistryView,
  containers: ContainerPlan,
  targets: ConversionTargets,
  host: HostView | undefined,
  write: boolean
): SiteReport[] {
  const sites: SiteReport[] = []

  const variants = config.getProperty('variants')
  if (Node.isPropertyAssignment(variants)) {
    const object = unwrapExpression(variants.getInitializerOrThrow())
    if (Node.isObjectLiteralExpression(object)) {
      for (const variant of object.getProperties()) {
        if (!Node.isPropertyAssignment(variant)) continue
        const variantName = compact(variant.getNameNode().getText())
        const branches = unwrapExpression(variant.getInitializerOrThrow())
        if (!Node.isObjectLiteralExpression(branches)) continue
        for (const branch of branches.getProperties()) {
          if (!Node.isPropertyAssignment(branch)) continue
          const branchName = compact(branch.getNameNode().getText())
          for (const style of variantStyleObjects(branch.getInitializerOrThrow())) {
            const site = convertStyleObject(
              style,
              'styled',
              `${label} variants.${variantName}.${branchName}`,
              registry,
              containers,
              targets,
              host,
              write
            )
            if (site) sites.push(site)
          }
        }
      }
    }
  }

  return sites
}

function conversionTargets(filePath: string): ConversionTargets {
  if (/\.web\.[cm]?[jt]sx?$/.test(filePath)) return 'web'
  if (/\.native\.[cm]?[jt]sx?$/.test(filePath)) return 'native'
  return 'shared'
}

function typeAwareHost(node: Node): HostView | undefined {
  const checker = node.getProject().getTypeChecker().compilerObject
  const host = resolveTamaguiHost(
    checker as unknown as Parameters<typeof resolveTamaguiHost>[0],
    node.compilerNode as unknown as Parameters<typeof resolveTamaguiHost>[1]
  )
  if (!host || node.getText() !== 'View') return host

  // Flat value typing deliberately admits arbitrary strings on narrow style
  // props, so TypeScript alone can no longer distinguish Text-only styles on
  // the primitive View. Keep the host assessment tied to the runtime table for
  // this canonical primitive; styled(View, …) and direct <View> share it.
  return {
    ...host,
    accepts: (property) => !(property in stylePropsTextOnly) && host.accepts(property),
  }
}

function inspectFile(
  sourceFile: SourceFile,
  registry: ModifierRegistryView,
  provenance: Provenance,
  write: boolean
): FileReport {
  const containers = planContainers(sourceFile, registry)
  const targets = conversionTargets(sourceFile.getFilePath())
  const sites: SiteReport[] = []
  const styledCalls = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((call) => provenance.isTamaguiStyledCall(call))
    .sort((left, right) => right.getStart() - left.getStart())
  const jsxOpenings = [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
  ]
    .filter((opening) => provenance.isTamaguiElement(opening))
    .sort((left, right) => right.getStart() - left.getStart())

  for (const opening of jsxOpenings) {
    const site = convertJsxSite(
      opening,
      registry,
      containers,
      targets,
      typeAwareHost(opening.getTagNameNode()),
      write
    )
    if (site) sites.push(site)
  }

  for (const call of styledCalls) {
    const component = call.getArguments()[0]
    const host = component ? typeAwareHost(component) : undefined
    const config = unwrapExpression(
      (call.getArguments()[1] as Expression | undefined) ?? call
    )
    if (!Node.isObjectLiteralExpression(config)) continue
    const label = `styled(${compact(call.getArguments()[0]?.getText() ?? 'unknown')}, …)`
    sites.push(...variantSites(config, label, registry, containers, targets, host, write))
    const site = convertStyleObject(
      config,
      'styled',
      label,
      registry,
      containers,
      targets,
      host,
      write
    )
    if (site) sites.push(site)
  }

  sites.sort(
    (left, right) => left.line - right.line || left.label.localeCompare(right.label)
  )
  return { file: relative(projectRoot, sourceFile.getFilePath()), sites }
}

const usage = `Converts Tamagui style syntax to V3 flat property values and reports what it cannot convert.

  npx @tamagui/codemod-flat-values [options] <files or directories...>

  --report <path>   where to write the Markdown report (default: ${relative(
    projectRoot,
    defaultReportPath
  )})
  --json <path>     also write the machine-readable report
  --write           rewrite every statically safe conversion in place
  --help            print this

Run it from your project root, which is where paths and the tsconfig resolve from.
Source files are only written with --write.`

function parseArguments(argv: readonly string[]): {
  reportPath: string
  jsonPath: string | null
  inputs: string[]
  write: boolean
} {
  const inputs: string[] = []
  let reportPath = defaultReportPath
  let jsonPath: string | null = null
  let write = false

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      console.log(usage)
      process.exit(0)
    }
    if (argument === '--write') {
      write = true
      continue
    }
    if (argument === '--report' || argument === '--json') {
      const next = argv[index + 1]
      if (!next) {
        console.error(`${argument} requires a path\n\n${usage}`)
        process.exit(2)
      }
      if (argument === '--report') reportPath = resolve(next)
      else jsonPath = resolve(next)
      index++
      continue
    }
    // an unknown option must never be read as a source path: that would silently
    // scan nothing and report a clean corpus
    if (argument.startsWith('-')) {
      console.error(`unknown option "${argument}"\n\n${usage}`)
      process.exit(2)
    }
    inputs.push(argument)
  }

  // no implicit corpus: migrating whatever happens to be under the working
  // directory is not something anyone means to ask for
  if (!inputs.length) {
    console.error(`no files or directories given\n\n${usage}`)
    process.exit(2)
  }

  return { reportPath, jsonPath, inputs, write }
}

const { reportPath, jsonPath, inputs, write } = parseArguments(process.argv.slice(2))
const { sourceFiles, ignoredFiles } = collectFiles(inputs)
for (const sourceFile of sourceFiles) {
  const diagnostics = (
    sourceFile.compilerNode as unknown as {
      parseDiagnostics?: readonly { messageText?: unknown }[]
    }
  ).parseDiagnostics
  if (diagnostics?.length) {
    console.error(
      `${relative(projectRoot, sourceFile.getFilePath())}: source has parse errors; no files were written`
    )
    process.exit(2)
  }
}
const originals = new Map(
  sourceFiles.map((sourceFile) => [sourceFile.getFilePath(), sourceFile.getFullText()])
)
const modifierRegistry = createModifierRegistry({
  mediaNames: mediaNames(sourceFiles),
  themeNames: themeNames(sourceFiles),
})
const provenance = createProvenance()
const files = sourceFiles.map((sourceFile) =>
  inspectFile(sourceFile, modifierRegistry.registry, provenance, write)
)
if (write) {
  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath()
    const parsed = ts.createSourceFile(
      filePath,
      sourceFile.getFullText(),
      ScriptTarget.Latest,
      true,
      filePath.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    ) as typeof sourceFile.compilerNode & {
      parseDiagnostics?: readonly ts.Diagnostic[]
    }
    if (parsed.parseDiagnostics?.length) {
      const details = parsed.parseDiagnostics
        .map((diagnostic) => {
          const start = diagnostic.start ?? 0
          const position = parsed.getLineAndCharacterOfPosition(start)
          const line = parsed.text.split(/\r?\n/)[position.line] ?? ''
          return `${position.line + 1}:${position.character + 1} ${ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n'
          )}\n  ${line.trim()}`
        })
        .join('\n')
      console.error(
        `${relative(projectRoot, filePath)}: rewrite produced parse errors; no files were written\n${details}`
      )
      process.exit(2)
    }
  }
}
const { text, summary } = renderReport(
  files,
  inputs.map((input) => relative(projectRoot, resolve(projectRoot, input))),
  modifierRegistry.diagnostics,
  ignoredFiles,
  write
)
mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, text)
if (jsonPath !== null) {
  mkdirSync(dirname(jsonPath), { recursive: true })
  writeFileSync(jsonPath, `${JSON.stringify({ files, summary }, null, 2)}\n`)
}

let written = 0
if (write) {
  for (const sourceFile of sourceFiles) {
    const next = sourceFile.getFullText()
    if (next === originals.get(sourceFile.getFilePath())) continue
    writeFileSync(sourceFile.getFilePath(), next)
    written++
  }
}

console.log(`wrote ${reportPath}`)
if (write) console.log(`rewrote ${written} source files`)
console.log(
  `${summary.sites} sites: ${summary.clean - summary.waiting} clean, ${summary.needsRelocation} need relocation, ${summary.unknownHost} unknown host, ${summary.ineligible} ineligible, ${summary.waiting} waiting on runtime support, ${summary.flagged} syntax-flagged; ${summary.ignoredFiles} source files ignored`
)
