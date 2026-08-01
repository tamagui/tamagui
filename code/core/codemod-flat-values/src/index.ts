import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveTamaguiHost } from '@tamagui/language-service/host'
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

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(packageDir, '../../..')
const defaultReportPath = resolve(packageDir, 'dry-run-report.md')

const defaultCorpus = [
  'code/kitchen-sink/src/usecases',
  'code/ui/tamagui/src/components/Button.tsx',
]

function collectFiles(inputs: readonly string[]): SourceFile[] {
  const project = new Project({
    tsConfigFilePath: resolve(repoRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: false,
      jsx: 4,
      target: ScriptTarget.ES2020,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      strictNullChecks: true,
      baseUrl: repoRoot,
    },
  })

  const files = new Map<string, SourceFile>()
  const missing: string[] = []
  for (const input of inputs) {
    const path = resolve(repoRoot, input)
    if (!existsSync(path)) {
      missing.push(input)
      continue
    }
    const pattern = /\.[cm]?[jt]sx?$/.test(path) ? path : `${path}/**/*.{ts,tsx}`
    const matched = project.addSourceFilesAtPaths(pattern)
    // an input that matches nothing must never reach the report: a typo in a
    // migration path would otherwise render an empty corpus as ready to cut over
    if (!matched.length) missing.push(input)
    for (const file of matched) files.set(file.getFilePath(), file)
  }

  if (missing.length) {
    console.error(
      `no source file matched ${missing.map((input) => `"${input}"`).join(', ')}`
    )
    process.exit(2)
  }

  return [...files.values()].sort((left, right) =>
    left.getFilePath().localeCompare(right.getFilePath())
  )
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

  const compound = config.getProperty('compoundVariants')
  if (Node.isPropertyAssignment(compound)) {
    const array = unwrapExpression(compound.getInitializerOrThrow())
    if (Node.isArrayLiteralExpression(array)) {
      for (const [index, element] of array.getElements().entries()) {
        const entry = unwrapExpression(element)
        if (!Node.isObjectLiteralExpression(entry)) continue
        const style = entry.getProperty('style')
        if (!Node.isPropertyAssignment(style)) continue
        for (const object of variantStyleObjects(style.getInitializerOrThrow())) {
          const site = convertStyleObject(
            object,
            'styled',
            `${label} compoundVariants[${index}]`,
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

  return sites
}

function conversionTargets(filePath: string): ConversionTargets {
  if (/\.web\.[cm]?[jt]sx?$/.test(filePath)) return 'web'
  if (/\.native\.[cm]?[jt]sx?$/.test(filePath)) return 'native'
  return 'shared'
}

function typeAwareHost(node: Node): HostView | undefined {
  const checker = node.getProject().getTypeChecker().compilerObject
  return resolveTamaguiHost(
    checker as unknown as Parameters<typeof resolveTamaguiHost>[0],
    node.compilerNode as unknown as Parameters<typeof resolveTamaguiHost>[1]
  )
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
  return { file: relative(repoRoot, sourceFile.getFilePath()), sites }
}

const usage = `Converts Tamagui style syntax to V3 flat property values and reports what it cannot convert.

  bun src/index.ts [options] [files or directories...]

  --report <path>   where to write the Markdown report (default: ${relative(
    repoRoot,
    defaultReportPath
  )})
  --json <path>     also write the machine-readable report
  --write           rewrite every statically safe conversion in place
  --help            print this

With no positional arguments the default corpus is ${defaultCorpus.join(' and ')}.
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

  return {
    reportPath,
    jsonPath,
    inputs: inputs.length ? inputs : defaultCorpus,
    write,
  }
}

const { reportPath, jsonPath, inputs, write } = parseArguments(process.argv.slice(2))
const sourceFiles = collectFiles(inputs)
for (const sourceFile of sourceFiles) {
  const diagnostics = (
    sourceFile.compilerNode as unknown as {
      parseDiagnostics?: readonly { messageText?: unknown }[]
    }
  ).parseDiagnostics
  if (diagnostics?.length) {
    console.error(
      `${relative(repoRoot, sourceFile.getFilePath())}: source has parse errors; no files were written`
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
      /x$/.test(filePath) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
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
        `${relative(repoRoot, filePath)}: rewrite produced parse errors; no files were written\n${details}`
      )
      process.exit(2)
    }
  }
}
const { text, summary } = renderReport(
  files,
  inputs.map((input) => relative(repoRoot, resolve(repoRoot, input))),
  modifierRegistry.diagnostics,
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
  `${summary.sites} sites: ${summary.clean - summary.waiting} clean, ${summary.needsRelocation} need relocation, ${summary.unknownHost} unknown host, ${summary.ineligible} ineligible, ${summary.waiting} waiting on runtime support, ${summary.flagged} syntax-flagged`
)
