import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ModuleKind,
  ModuleResolutionKind,
  Node,
  Project,
  ScriptTarget,
  SyntaxKind,
  type Expression,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'ts-morph'
import { convertJsxSite, convertStyleObject, type SiteReport } from './convert'
import { compact, unwrapExpression } from './expressions'
import {
  codemodMediaNames,
  createModifierRegistry,
  type ModifierRegistryView,
} from './grammar'
import { isLegacyConditionName, resolveLegacyName } from './legacyNames'
import { renderReport, type FileReport } from './report'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(packageDir, '../../..')
const defaultReportPath = resolve(packageDir, 'dry-run-report.md')

const defaultCorpus = [
  'code/kitchen-sink/src/usecases',
  'code/ui/tamagui/src/components/Button.tsx',
]

function collectFiles(inputs: readonly string[]): SourceFile[] {
  const project = new Project({
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

  const patterns = inputs.map((input) => {
    const path = resolve(repoRoot, input)
    return /\.[cm]?[jt]sx?$/.test(path) ? path : `${path}/**/*.{ts,tsx}`
  })
  return project
    .addSourceFilesAtPaths(patterns)
    .sort((left, right) => left.getFilePath().localeCompare(right.getFilePath()))
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

/**
 * The group names whose descendants use a legacy container-size condition. V3
 * splits the group from the query container, so those groups have to declare one.
 */
function containerGroups(
  sourceFile: SourceFile,
  registry: ModifierRegistryView
): Set<string> {
  const groups = new Set<string>()
  for (const name of conditionNames(sourceFile)) {
    if (!isLegacyConditionName(name)) continue
    const resolution = resolveLegacyName(name, registry)
    if (resolution.ok && resolution.resolved.container) {
      groups.add(resolution.resolved.container.group ?? '')
    }
  }
  return groups
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
  groups: ReadonlySet<string>
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
              groups
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
            groups
          )
          if (site) sites.push(site)
        }
      }
    }
  }

  return sites
}

function inspectFile(sourceFile: SourceFile, registry: ModifierRegistryView): FileReport {
  const groups = containerGroups(sourceFile, registry)
  const sites: SiteReport[] = []

  for (const kind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
  ] as const) {
    for (const opening of sourceFile.getDescendantsOfKind(kind)) {
      const site = convertJsxSite(opening, registry, groups)
      if (site) sites.push(site)
    }
  }

  for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (call.getExpression().getText() !== 'styled') continue
    const config = unwrapExpression(
      (call.getArguments()[1] as Expression | undefined) ?? call
    )
    if (!Node.isObjectLiteralExpression(config)) continue
    const label = `styled(${compact(call.getArguments()[0]?.getText() ?? 'unknown')}, …)`
    const site = convertStyleObject(config, 'styled', label, registry, groups)
    if (site) sites.push(site)
    sites.push(...variantSites(config, label, registry, groups))
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
  --help            print this

With no positional arguments the default corpus is ${defaultCorpus.join(' and ')}.
Source files are never written.`

function parseArguments(argv: readonly string[]): {
  reportPath: string
  jsonPath: string | null
  inputs: string[]
} {
  const inputs: string[] = []
  let reportPath = defaultReportPath
  let jsonPath: string | null = null

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      console.log(usage)
      process.exit(0)
    }
    if (argument === '--report' || argument === '--json') {
      const next = argv[index + 1]
      if (!next) throw new Error(`${argument} requires a path`)
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

  return { reportPath, jsonPath, inputs: inputs.length ? inputs : defaultCorpus }
}

const { reportPath, jsonPath, inputs } = parseArguments(process.argv.slice(2))
const sourceFiles = collectFiles(inputs)
const modifierRegistry = createModifierRegistry({
  mediaNames: codemodMediaNames,
  themeNames: themeNames(sourceFiles),
})
const files = sourceFiles.map((sourceFile) =>
  inspectFile(sourceFile, modifierRegistry.registry)
)
const { text, summary } = renderReport(
  files,
  inputs.map((input) => relative(repoRoot, resolve(repoRoot, input))),
  modifierRegistry.diagnostics
)
mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, text)
if (jsonPath !== null) {
  mkdirSync(dirname(jsonPath), { recursive: true })
  writeFileSync(jsonPath, `${JSON.stringify({ files, summary }, null, 2)}\n`)
}

console.log(`wrote ${reportPath}`)
console.log(
  `${summary.sites} sites: ${summary.clean - summary.waiting} converted, ${summary.waiting} waiting on runtime support, ${summary.flagged} flagged`
)
