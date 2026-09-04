import { afterEach, describe, expect, test } from 'bun:test'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sanitize, type SiteReport } from '../src/convert'
import type { FunctionalVariantReport } from '../src/functionalVariants'
import type { SheetFrameReport } from '../src/sheetAnatomy'
import type { TransitionReport } from '../src/transition'
import {
  codemodMediaNames,
  createModifierRegistry,
  evaluateProgram,
  legacyPartComposite,
  parseValue,
  programEligibility,
  type ModifierRegistryView,
} from '../src/grammar'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(packageDir, '../../..')
const entry = 'code/core/codemod-flat-values/src/index.ts'
// the corpus the migrated repo is held to: every v1 site here is a real regression
const defaultCorpus = [
  'code/kitchen-sink/src/usecases',
  'code/ui/tamagui/src/components/Button.tsx',
]
const temporaryDirectories: string[] = []

interface Result {
  files: Array<{
    file: string
    sites: SiteReport[]
    functionalVariants: FunctionalVariantReport[]
    sheetFrames: SheetFrameReport[]
    transitions: TransitionReport[]
  }>
  summary: {
    sites: number
    clean: number
    needsRelocation: number
    unknownHost: number
    ineligible: number
    flagged: number
    warnings: number
    waiting: number
    ignoredFiles: number
    functionalVariantSites: number
    functionalVariantConverted: number
    functionalVariantFlagged: number
    functionalVariantFlags: Record<string, number>
    sheetFrames: number
    sheetFramesFlagged: number
    transitions: number
    transitionsFlagged: number
  }
}

function runOn(inputs: readonly string[]): Result {
  const directory = mkdtempSync(join(tmpdir(), 'flat-values-codemod-'))
  temporaryDirectories.push(directory)
  const jsonPath = join(directory, 'report.json')

  const result = Bun.spawnSync({
    cmd: [
      process.execPath,
      entry,
      '--report',
      join(directory, 'report.md'),
      '--json',
      jsonPath,
      ...inputs,
    ],
    cwd: repoRoot,
    stderr: 'pipe',
    stdout: 'pipe',
  })
  expect(result.exitCode, result.stderr.toString()).toBe(0)
  return JSON.parse(readFileSync(jsonPath, 'utf8')) as Result
}

function run(source: string): Result {
  return runOn([fixture(source)])
}

function runWrite(source: string): string {
  const sourcePath = fixture(source)
  const directory = mkdtempSync(join(tmpdir(), 'flat-values-write-'))
  temporaryDirectories.push(directory)
  const result = Bun.spawnSync({
    cmd: [
      process.execPath,
      entry,
      '--write',
      '--report',
      join(directory, 'report.md'),
      sourcePath,
    ],
    cwd: repoRoot,
    stderr: 'pipe',
    stdout: 'pipe',
  })
  expect(result.exitCode, result.stderr.toString()).toBe(0)
  return readFileSync(sourcePath, 'utf8')
}

function fixture(source: string, fileName = 'fixture.tsx'): string {
  // Keep source fixtures inside the repository so TypeScript resolves the same
  // Tamagui package graph the codemod sees in its real corpus.
  const directory = mkdtempSync(join(packageDir, 'test/.flat-values-fixture-'))
  temporaryDirectories.push(directory)
  const sourcePath = join(directory, fileName)
  writeFileSync(sourcePath, source)
  return sourcePath
}

/** the run itself is the subject: what it exits with and what it leaves behind */
function runRaw(inputs: readonly string[]): {
  exitCode: number
  stderr: string
  reportPath: string
} {
  const directory = mkdtempSync(join(tmpdir(), 'flat-values-codemod-'))
  temporaryDirectories.push(directory)
  const reportPath = join(directory, 'report.md')
  const result = Bun.spawnSync({
    cmd: [process.execPath, entry, '--report', reportPath, ...inputs],
    cwd: repoRoot,
    stderr: 'pipe',
    stdout: 'pipe',
  })
  return {
    exitCode: result.exitCode,
    stderr: result.stderr.toString(),
    reportPath,
  }
}

function sites(result: Result): SiteReport[] {
  return result.files.flatMap((file) => file.sites)
}

function transitions(result: Result): TransitionReport[] {
  return result.files.flatMap((file) => file.transitions)
}

function only(result: Result): SiteReport {
  const found = sites(result)
  expect(found.length, JSON.stringify(found, null, 2)).toBe(1)
  return found[0]
}

function labeled(result: Result, label: string): SiteReport {
  const found = sites(result).filter((site) => site.label.includes(label))
  expect(found.length, JSON.stringify(sites(result).map((site) => site.label))).toBe(1)
  return found[0]
}

function functionalVariants(result: Result): FunctionalVariantReport[] {
  return result.files.flatMap((file) => file.functionalVariants)
}

function onlyFunctional(result: Result): FunctionalVariantReport {
  const found = functionalVariants(result)
  expect(found.length, JSON.stringify(found, null, 2)).toBe(1)
  return found[0]
}

function programs(site: SiteReport): Record<string, string> {
  const map: Record<string, string> = {}
  for (const program of site.programs) map[program.name] = program.value
  return map
}

function codes(site: SiteReport): string[] {
  return site.flags.map((flag) => flag.code)
}

function warningCodes(site: SiteReport): string[] {
  return site.warnings.map((warning) => warning.code)
}

function pendingCodes(site: SiteReport): string[] {
  return [...new Set(site.pending.map((flag) => flag.code))]
}

function assessmentVerdicts(site: SiteReport): string[] {
  return [...new Set(site.assessments.map((assessment) => assessment.verdict))]
}

const { registry } = createModifierRegistry({
  mediaNames: codemodMediaNames,
  themeNames: new Set(['light', 'dark']),
})

interface Active {
  states?: readonly string[]
  themes?: readonly string[]
  media?: readonly string[]
  platform?: string
  groups?: readonly string[]
  containers?: readonly string[]
}

/** what the converted program resolves to under one set of active conditions */
function resolve1(
  value: string,
  active: Active,
  view: ModifierRegistryView = registry
): string | null {
  const parsed = parseValue(value, view)
  if (!parsed.ok) {
    throw new Error(`"${value}" does not parse: ${JSON.stringify(parsed.errors)}`)
  }
  return evaluateProgram(parsed.value, view, {
    states: new Set(active.states ?? []),
    themes: new Set(active.themes ?? []),
    media: new Set(active.media ?? []),
    platform: active.platform ?? 'web',
    groups: (modifier) => (active.groups ?? []).includes(modifier),
    containers: (modifier) => (active.containers ?? []).includes(modifier),
  })
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true })
  }
})

describe('base values', () => {
  test('a numeric base a condition targets folds into the program', () => {
    const site = only(
      runOn([
        fixture(
          `import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      )`,
          'fixture.native.tsx'
        ),
      ])
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({ opacity: '0.5 enter:0 exit:0' })
    expect(resolve1('0.5 enter:0 exit:0', {})).toBe('0.5')
    expect(resolve1('0.5 enter:0 exit:0', { states: ['enter'] })).toBe('0')
    expect(resolve1('0.5 enter:0 exit:0', { states: ['exit'] })).toBe('0')
  })

  test('a numeric shorthand base folds once for every longhand it expands to', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View borderWidth={1} focusStyle={{ borderWidth: 2 }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({ borderWidth: '1px focus:2px' })
    expect(resolve1('1px focus:2px', {})).toBe('1px')
    expect(resolve1('1px focus:2px', { states: ['focus'] })).toBe('2px')
  })

  test('a base no condition targets stays exactly as authored', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View width={100} bg="$blue10" hoverStyle={{ bg: 'red' }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(warningCodes(site)).toEqual(['legacy-palette-token'])
    expect(site.warnings[0]?.detail).toContain('`blue10`')
    // the authored shorthand is kept: it is the smallest edit that still reads back
    // as the same program
    expect(programs(site)).toEqual({ bg: 'blue10 hover:red' })
    expect(site.after).toBe('width={100} bg="blue10 hover:red"')
  })

  test('a token inside a composite value loses its prefix when the program has clauses', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View boxShadow="0 4px 12px $shadowColor" hoverStyle={{ boxShadow: 'none' }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({ boxShadow: '0 4px 12px shadow-color hover:none' })
  })

  test('built-in theme names migrate explicitly and removed backgroundActive uses press', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
  <View
    boxShadow="0 0 1px $accentBackground, 0 0 1px $accentColor, 0 0 1px $colorHover, 0 0 1px $colorPress, 0 0 1px $colorFocus, 0 0 1px $backgroundHover, 0 0 1px $backgroundPress, 0 0 1px $backgroundFocus, 0 0 1px $borderColor, 0 0 1px $borderColorHover, 0 0 1px $borderColorFocus, 0 0 1px $borderColorPress, 0 0 1px $outlineColor, 0 0 1px $placeholderColor, 0 0 1px $colorTransparent, 0 0 1px $shadowColor"
    hoverStyle={{ boxShadow: '0 0 1px $backgroundActive' }}
  />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      boxShadow:
        '0 0 1px accent-background, 0 0 1px accent-color, 0 0 1px color-hover, 0 0 1px color-press, 0 0 1px color-focus, 0 0 1px background-hover, 0 0 1px background-press, 0 0 1px background-focus, 0 0 1px border-color, 0 0 1px border-color-hover, 0 0 1px border-color-focus, 0 0 1px border-color-press, 0 0 1px outline-color, 0 0 1px placeholder-color, 0 0 1px color-transparent, 0 0 1px shadow-color hover:0 0 1px background-press',
    })
  })

  test('a clause-free token becomes a base-only program', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View padding="$4" bg="$blue10" hoverStyle={{ bg: 'red' }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(pendingCodes(site)).toEqual([])
    expect(programs(site)).toEqual({
      padding: '4',
      bg: 'blue10 hover:red',
    })
    expect(site.after).toBe('padding="4" bg="blue10 hover:red"')
  })

  test('a rewritable token expression becomes a dynamic base-only program', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = ({ active }) => (
        <Text color={active ? '$red10' : '$blue10'} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(warningCodes(site)).toEqual(['legacy-palette-token'])
    expect(site.warnings[0]?.detail).toContain('`blue10`')
    expect(site.warnings[0]?.detail).toContain('`red10`')
    expect(pendingCodes(site)).toEqual([])
    expect(programs(site)).toEqual({
      color: '${active ? "red10" : "blue10"}',
    })
    expect(site.after).toBe('color={`${active ? "red10" : "blue10"}`}')
  })

  test('does not warn for custom or absolute palette names', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View bg="$brand10" hoverStyle={{ bg: 'blue-500' }} />
)`)
    )

    expect(programs(site)).toEqual({ bg: 'brand10 hover:blue-500' })
    expect(site.warnings).toEqual([])
  })

  test('prints preserved palette names as configuration warnings', () => {
    const sourcePath = fixture(`import { Text } from 'tamagui'
export const Fixture = ({ active }) => (
  <Text color={active ? '$red10' : '$blue10'} />
)`)
    const result = runRaw([sourcePath])

    expect(result.exitCode, result.stderr).toBe(0)
    const report = readFileSync(result.reportPath, 'utf8')
    expect(report).toContain('Configuration warnings:')
    expect(report).toContain('**legacy-palette-token**')
    expect(report).toContain('`blue10`, `red10`')
  })

  test('a numeric dot-path token is renamed to its dash spelling', () => {
    // v5 spells the half-step $1.5, v3 spells the same token 1-5, and both
    // resolve to 4. renaming is therefore value-neutral, where flagging left
    // the single largest category of manual work in a real migration.
    const withClause = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View gap="$1.5" hoverStyle={{ gap: '$2' }} />
      )`)
    )
    expect(codes(withClause)).not.toContain('legacy-token-dot-path')
    expect(withClause.after).toContain('gap="1-5 hover:2"')

    const clauseFree = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => <View gap="$1.5" bg="$blue10" hoverStyle={{ bg: 'red' }} />`)
    )
    expect(codes(clauseFree)).not.toContain('legacy-token-dot-path')
    expect(clauseFree.after).toContain('gap="1-5"')
    // two runs in one test: each spawns the CLI over a fresh ts-morph project
  }, 30_000)

  test('a non-numeric dot-path token is still reported', () => {
    // nothing can derive what `$brand.primary` was meant to become, so it
    // stays the author's call.
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => <View bg="$brand.primary" hoverStyle={{ bg: 'red' }} />`)
    )
    expect(codes(site)).toContain('legacy-token-dot-path')
  }, 30_000)

  test('a site with no v1 syntax is not a conversion site', () => {
    expect(
      sites(
        run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => <View width={10} m={2} />`)
      )
    ).toEqual([])
    expect(
      sites(
        run(`import { View } from 'tamagui'
export const Fixture = ({ active }) => <View rotate={active ? '180deg' : '0deg'} />`)
      )
    ).toEqual([])
    expect(
      sites(
        run(`import { View } from 'tamagui'
export const Fixture = ({ active }) => <View rotate={\`\${active ? '180deg' : '0deg'}\`} />`)
      )
    ).toEqual([])
    // three runs in one test: each spawns the CLI over a fresh ts-morph project
  }, 30_000)
})

describe('conditions', () => {
  test('state, theme, and media conditions become one ordered program', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View
          bg="$surface"
          hoverStyle={{ bg: '$surfaceHover' }}
          $theme-dark={{ bg: '$surfaceDark' }}
          $sm={{ bg: '$surfaceSmall' }}
        />
      )`)
    )

    expect(codes(site)).toEqual([])
    const value = programs(site).bg
    expect(value).toBe('surface hover:surfaceHover dark:surfaceDark sm:surfaceSmall')
    expect(resolve1(value, {})).toBe('surface')
    expect(resolve1(value, { states: ['hover'] })).toBe('surfaceHover')
    expect(resolve1(value, { themes: ['dark'] })).toBe('surfaceDark')
    // state outranks theme at equal depth, independent of authored clause order
    expect(resolve1(value, { states: ['hover'], themes: ['dark'] })).toBe('surfaceHover')
    expect(resolve1(value, { media: ['sm'], themes: ['dark'] })).toBe('surfaceDark')
  })

  test('nested condition objects become one clause per condition set', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View backgroundColor="blue" $web={{ my: 10, hoverStyle: { backgroundColor: 'green' } }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      backgroundColor: 'blue web:hover:green',
      my: 'web:10px',
    })
    expect(resolve1('blue web:hover:green', { states: ['hover'], platform: 'web' })).toBe(
      'green'
    )
    expect(resolve1('blue web:hover:green', { states: ['hover'], platform: 'ios' })).toBe(
      'blue'
    )
    expect(resolve1('web:10px', { platform: 'ios' })).toBe(null)
  })

  test('a named group state condition keeps its group name', () => {
    const site = labeled(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
	const Inner = styled(Text, {
        color: 'black',
        '$group-card-hover': { color: 'red' },
      })`),
      'styled(Text'
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({ color: 'black group-hover/card:red' })
    expect(resolve1('black group-hover/card:red', { groups: ['group-hover/card'] })).toBe(
      'red'
    )
  })

  test('a group container size condition splits into a container query and adds the container', () => {
    const result = run(`import { Text, TextInput, View, styled } from 'tamagui'
const Card = styled(View, { group: 'card' })
      const Inner = styled(Text, {
        color: 'black',
        '$group-card-maxMd': { color: 'red' },
        '$group-card-maxMd-hover': { color: 'blue' },
      })`)

    const found = sites(result)
    expect(found.length).toBe(2)
    const [card, inner] = found
    expect(card.after).toBe(`group: 'card', container: "card"`)
    expect(card.notes.length).toBe(1)
    // this is the only declaration of the group in the file, but no JSX ancestry
    // shows it wrapping the consumer, so the placement is the human's call
    expect(codes(card)).toEqual(['unproven-container-group'])
    expect(pendingCodes(card)).toEqual([])

    expect(codes(inner)).toEqual([])
    expect(programs(inner)).toEqual({
      color: 'black @max-md/card:red @max-md/card:group-hover/card:blue',
    })
    const value = programs(inner).color
    expect(resolve1(value, { containers: ['@max-md/card'] })).toBe('red')
    expect(
      resolve1(value, {
        containers: ['@max-md/card'],
        groups: ['group-hover/card'],
      })
    ).toBe('blue')
    expect(resolve1(value, { groups: ['group-hover/card'] })).toBe('black')
  })

  test('a group condition with no state and no size is reported', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View bg="red" $group-card={{ bg: 'blue' }} />
      )`)
    )

    expect(codes(site)).toContain('legacy-group-presence')
    expect(site.after).toContain('$group-card=')
    expect(site.legacyLeft).toBe(1)
  })

  test('a conditional non-style prop is reported, never dropped', () => {
    // numberOfLines became a style prop with line-clamp, so testID stands in
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => <Text $sm={{ testID: 'small' }} width={200} />`)
    )

    expect(codes(site)).toEqual(['non-style-condition-entry'])
    expect(site.after).toContain("$sm={{ testID: 'small' }}")
  })

  test('a runtime spread inside a condition object is reported', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = (props) => (
        <TextInput bg="$blue10" focusStyle={{ margin: 0, ...props.focusStyle }} />
      )`)
    )

    expect(codes(site)).toEqual(['dynamic-legacy-condition'])
    expect(site.after).toContain('...props.focusStyle')
  })
})

describe('dynamic values', () => {
  test('token spellings inside a conditional expression are rewritten in place', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = ({ active }) => (
        <Text color={active ? '$red10' : '$blue10'} hoverStyle={{ color: '$green10' }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      color: '${active ? "red10" : "blue10"} hover:green10',
    })
    expect(site.programs[0].dynamic).toBe(true)
  })

  test('a provable dynamic leaf becomes an interpolated clause payload', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
const GREEN = 'rgb(27, 122, 61)'
      const GREY = 'rgb(217, 215, 210)'
      export const Fixture = () => (
        <View backgroundColor={GREEN} disabledStyle={{ backgroundColor: GREY }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({ backgroundColor: '${GREEN} disabled:${GREY}' })
    // the parser is paren aware, so a color function with spaces stays one payload
    expect(
      resolve1('rgb(27, 122, 61) disabled:rgb(217, 215, 210)', { states: ['disabled'] })
    ).toBe('rgb(217, 215, 210)')
  })

  test('a numeric dynamic leaf carries the property unit', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = ({ going }) => (
        <View enterStyle={{ x: going > 0 ? 80 : -80, opacity: 0 }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      x: 'enter:${going > 0 ? 80 : -80}px',
      opacity: 'enter:0',
    })
  })

  test('a legacy token reached through a constant is reported, not guessed', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
const RADIUS = '$6'
      export const Fixture = () => (
        <View rounded={RADIUS} hoverStyle={{ rounded: '$4' }} />
      )`)
    )

    expect(codes(site)).toContain('legacy-token-constant')
    expect(site.after).toContain('rounded={RADIUS}')
    expect(site.after).toContain('hoverStyle=')
  })

  test('a value with no provable type keeps its condition object authored', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = ({ anything }) => (
        <View opacity={anything} hoverStyle={{ opacity: 1 }} />
      )`)
    )

    expect(codes(site)).toEqual(['unprovable-dynamic-value'])
    expect(site.after).toContain('opacity={anything}')
    expect(site.after).toContain('hoverStyle={{ opacity: 1 }}')
  })

  test('migrates the v2 transition array without touching the rest of the site', () => {
    const result = run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View
          bg="$blue10"
          transition={['quick', { opacity: 'lazy' }]}
          shadowOffset={{ width: 0, height: 20 }}
          transform={[{ translateX: 20 }]}
        />
      )`)

    expect(transitions(result).map((site) => site.after)).toEqual([
      `transition={{ preset: 'quick', opacity: 'lazy' }}`,
    ])
    const site = only(result)
    expect(codes(site)).toEqual([])
    expect(site.inventory).toEqual([])
    expect(site.after).toContain('shadowOffset={{ width: 0, height: 20 }}')
    expect(site.after).toContain('transform={[{ translateX: 20 }]}')
  })

  test('spells `default` as `preset` and leaves a dynamic transition alone', () => {
    const result = run(`import { View } from 'tamagui'
export const ObjectFixture = () => (
  <View bg="$blue10" transition={{ opacity: '500ms', default: 'quick' }} />
)
export const DynamicFixture = ({ transition }) => (
  <View bg="$blue10" transition={transition} />
)`)

    // only the v2 value is a transition site; the dynamic one is left authored
    expect(transitions(result).map((site) => site.after)).toEqual([
      `transition={{ preset: 'quick', opacity: '500ms' }}`,
    ])
    expect(sites(result).map((site) => site.after)).toEqual([
      `bg="blue10" transition={{ opacity: '500ms', default: 'quick' }}`,
      'bg="blue10" transition={transition}',
    ])
  })

  test('folds a removed animateOnly list into the transition it narrowed', () => {
    const written = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View transition="quick" animateOnly={['transform', 'opacity']} opacity={0.5} />
)`)
    expect(written).toContain(
      `transition={{ preset: 'quick', properties: 'transform, opacity' }}`
    )
    expect(written).not.toContain('animateOnly')
    expect(written).toContain('opacity={0.5}')
  })

  test('drops a per-property entry the animateOnly list filtered out', () => {
    const written = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View transition={['quick', { opacity: 'lazy' }]} animateOnly={['transform']} />
)`)
    expect(written).toContain(`transition={{ preset: 'quick', properties: 'transform' }}`)
    expect(written).not.toContain('lazy')
  })

  test('an empty animateOnly list is `none`', () => {
    const written = runWrite(`import { View } from 'tamagui'
export const Fixture = () => <View transition="quick" animateOnly={[]} />`)
    expect(written).toContain(`transition="none"`)
    expect(written).not.toContain('animateOnly')
  })

  test('flags an animateOnly the migration cannot fold', () => {
    const dynamic = run(`import { View } from 'tamagui'
export const Fixture = (props) => (
  <View transition={props.animation} animateOnly={['transform']} />
)`)
    expect(
      transitions(dynamic).flatMap((site) => site.flags.map((flag) => flag.code))
    ).toEqual(['unsupported-legacy-value'])

    const orphan = run(`import { View } from 'tamagui'
export const Fixture = () => <View animateOnly={['transform']} />`)
    expect(
      transitions(orphan).flatMap((site) => site.flags.map((flag) => flag.detail))
    ).toEqual([
      'the removed `animateOnly` has no `transition` next to it; spell it as `properties` wherever the transition is authored',
    ])
  })

  test('folds animateOnly inside a styled() definition', () => {
    const written = runWrite(`import { View, styled } from 'tamagui'
export const Card = styled(View, {
  transition: 'quick',
  animateOnly: ['transform'],
})`)
    expect(written).toContain(`transition: { preset: 'quick', properties: 'transform' }`)
    expect(written).not.toContain('animateOnly')
  })

  test('writes the migrated transition and drops the array form', () => {
    const written = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View transition={['quick', { opacity: { overshootClamping: true } }]} />
)`)
    expect(written).toContain(
      `transition={{ preset: 'quick', opacity: { preset: 'quick', spring: { overshootClamping: true } } }}`
    )
    expect(written).not.toContain('[')
  })
})

describe('structured native values', () => {
  test('converts static transform arrays when a condition needs one program', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    transform={[{ translateX: 0 }, { rotate: '0deg' }, { scale: 1 }]}
    hoverStyle={{
      transform: [{ translateX: 10 }, { rotate: '45deg' }, { scale: 2 }],
    }}
  />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(site.inventory).toEqual([])
    expect(programs(site)).toEqual({
      transform:
        'translateX(0px) rotate(0deg) scale(1) hover:translateX(10px) rotate(45deg) scale(2)',
    })
  })

  test('refuses a unitless string length instead of guessing points', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    transform={[{ translateY: '20' }]}
    hoverStyle={{ transform: [{ translateY: '-5' }] }}
  />
)`)
    )

    expect(codes(site)).toEqual(['structured-transform-unitless-transform-value'])
    expect(site.inventory).toEqual([])
    expect(site.after).toContain(`transform={[{ translateY: '20' }]}`)
    expect(site.after).toContain('hoverStyle=')
  })

  test('retains a dynamic transform array with a specific diagnostic', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = ({ x }) => (
  <View
    transform={[{ translateX: x }]}
    hoverStyle={{ transform: [{ translateX: 10 }] }}
  />
)`)
    )

    expect(codes(site)).toEqual(['structured-transform-dynamic'])
    expect(site.inventory).toEqual([])
    expect(site.after).toContain('transform={[{ translateX: x }]}')
    expect(site.after).toContain('hoverStyle=')
  })

  test('recognizes a referenced transform array as structured before type fallback', () => {
    const site = only(
      run(`import { View } from 'tamagui'
declare function getTransform(): Array<{ translateX: number }>
const transform = getTransform()
export const Fixture = () => (
  <View
    transform={transform}
    hoverStyle={{ transform: [{ translateX: 10 }] }}
  />
)`)
    )

    expect(codes(site)).toEqual(['structured-transform-dynamic'])
    expect(site.inventory).toEqual([])
    expect(site.after).toContain('transform={transform}')
    expect(site.after).toContain('hoverStyle=')
  })

  test('keeps ordinary string payloads on structured-capable properties', () => {
    const site = only(
      run(`import { Text } from 'tamagui'
export const Fixture = () => (
  <Text
    transform="scale(1)"
    fontVariant="small-caps"
    backgroundImage="linear-gradient(red, blue)"
    hoverStyle={{
      transform: 'scale(2)',
      fontVariant: 'tabular-nums',
      backgroundImage: 'linear-gradient(blue, red)',
    }}
  />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      backgroundImage: 'linear-gradient(red, blue) hover:linear-gradient(blue, red)',
      fontVariant: 'small-caps hover:tabular-nums',
      transform: 'scale(1) hover:scale(2)',
    })
  })

  test('keeps a referenced CSS transform string on the string path', () => {
    const site = only(
      run(`import { View } from 'tamagui'
declare const transform: string
export const Fixture = () => (
  <View transform={transform} hoverStyle={{ transform: 'scale(2)' }} />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      transform: '${transform} hover:scale(2)',
    })
  })

  test('retains matrix arrays with a portability diagnostic', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    transform={[{ matrix: [1, 0, 0, 1, 0, 0] }]}
    hoverStyle={{ transform: [{ matrix: [1, 0, 0, 1, 10, 0] }] }}
  />
)`)
    )

    expect(codes(site)).toEqual(['structured-transform-matrix'])
    expect(site.inventory).toEqual([])
    expect(site.after).toContain('matrix: [1, 0, 0, 1, 0, 0]')
    expect(site.after).toContain('hoverStyle=')
  })

  test('converts static font variant arrays to the CSS token-list spelling', () => {
    const site = only(
      run(`import { Text } from 'tamagui'
export const Fixture = () => (
  <Text
    fontVariant={['small-caps', 'tabular-nums']}
    hoverStyle={{ fontVariant: ['oldstyle-nums'] }}
  />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(site.inventory).toEqual([])
    expect(programs(site)).toEqual({
      fontVariant: 'small-caps tabular-nums hover:oldstyle-nums',
    })
  })

  test('converts a static native linear-gradient object to its CSS spelling', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    backgroundImage={[{
      type: 'linear-gradient',
      direction: '45deg',
      colorStops: [
        { color: '$red10', positions: [0, 25, 40] },
        { color: null, positions: [50] },
        { color: '#00f', positions: [100] },
      ],
    }]}
    hoverStyle={{
      backgroundImage: [{
        type: 'linear-gradient',
        direction: 'to bottom',
        colorStops: [
          { color: '$blue10', positions: ['0%'] },
          { color: 'white', positions: ['100%'] },
        ],
      }],
    }}
  />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(site.inventory).toEqual([])
    expect(programs(site)).toEqual({
      backgroundImage:
        'linear-gradient(45deg, red10 0px, red10 25px, red10 40px, 50px, #00f 100px) hover:linear-gradient(to bottom, blue10 0%, white 100%)',
    })
  })

  test('retains a dynamic gradient with a shape-specific diagnostic', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = ({ color }) => (
  <View
    backgroundImage={[{
      type: 'linear-gradient',
      colorStops: [{ color }, { color: 'white' }],
    }]}
    hoverStyle={{
      backgroundImage: [{
        type: 'linear-gradient',
        colorStops: [{ color: 'black' }, { color: 'white' }],
      }],
    }}
  />
)`)
    )

    expect(codes(site)).toEqual(['structured-background-image-dynamic'])
    expect(site.inventory).toEqual([])
    expect(site.after).toContain('backgroundImage={[')
    expect(site.after).toContain('hoverStyle=')
  })

  test('keeps standalone shadow offsets natural and uses the part-prop contract when conditional', () => {
    const site = only(
      run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    shadowOffset={{ width: 0, height: 2 }}
    hoverStyle={{ shadowOffset: { width: 0, height: 4 } }}
  />
)`)
    )

    expect(codes(site)).toEqual([])
    expect(site.inventory).toEqual([])
    expect(site.assessmentVerdict).toBe('ineligible')
    expect(site.assessments).toContainEqual({
      property: 'shadowOffset',
      verdict: 'ineligible',
      reasons: expect.arrayContaining([
        expect.objectContaining({
          dimension: 'property',
          remedy: expect.stringContaining('boxShadow'),
        }),
      ]),
    })
  })
})

describe('program eligibility parity', () => {
  test('refuses every part prop the runtime contract keeps on the legacy path', () => {
    const entries = Object.entries(legacyPartComposite)
    const result = run(`import { View } from 'tamagui'
export const Fixture = () => (
  <>
    ${entries
      .map(([prop]) => `<View hoverStyle={{ ${prop}: 'blocked' }} />`)
      .join('\n    ')}
  </>
)`)
    const reports = sites(result)

    expect(reports).toHaveLength(entries.length)
    for (const [prop, composite] of entries) {
      expect(programEligibility(prop)).toBe('legacy-part')
      const site = reports.find((candidate) =>
        candidate.before.includes(`${prop}: 'blocked'`)
      )
      expect(site, prop).toBeDefined()
      expect(programs(site!)).toEqual({})
      expect(site!.after).toContain('hoverStyle=')
      expect(site!.flags).toEqual([])
      expect(site!.assessmentVerdict).toBe('ineligible')
      expect(site!.assessments).toContainEqual({
        property: prop,
        verdict: 'ineligible',
        reasons: expect.arrayContaining([
          expect.objectContaining({
            dimension: 'property',
            remedy: expect.stringContaining(`\`${composite}\``),
          }),
        ]),
      })
    }
  })
})

describe('conversion assessment', () => {
  test('converts exitStyle in a shared file', () => {
    const result = run(`import { View } from 'tamagui'
export const Fixture = () => (
  <View opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
)`)
    const site = only(result)

    expect(programs(site)).toEqual({ opacity: '0.5 enter:0 exit:0' })
    expect(site.after).not.toContain('exitStyle=')
    expect(site.assessments).toEqual([])
    expect(result.summary).toMatchObject({
      sites: 1,
      clean: 1,
      needsRelocation: 0,
      unknownHost: 0,
      ineligible: 0,
    })
  })

  test('allows exit in a native file when the host type accepts the property', () => {
    const sourcePath = fixture(
      `import { View } from 'tamagui'
export const Fixture = () => <View exitStyle={{ opacity: 0 }} />`,
      'fixture.native.tsx'
    )
    const site = only(runOn([sourcePath]))

    expect(programs(site)).toEqual({ opacity: 'exit:0' })
    expect(site.assessments).toEqual([])
  })

  test('reports text-only styles on View while accepting them on Text', () => {
    const result = run(`import { Text, View } from 'tamagui'
export const Fixture = () => (
  <>
    <View hoverStyle={{ color: '$red10' }} />
    <Text hoverStyle={{ color: '$red10' }} />
  </>
)`)
    const view = labeled(result, '<View>')
    const text = labeled(result, '<Text>')

    expect(programs(view)).toEqual({ color: 'hover:red10' })
    expect(view.after).not.toContain('hoverStyle=')
    expect(view.assessments).toContainEqual({
      property: 'color',
      verdict: 'needs-relocation',
      reasons: expect.arrayContaining([
        expect.objectContaining({
          dimension: 'host',
          message: expect.stringContaining('View'),
        }),
      ]),
    })
    expect(programs(text)).toEqual({ color: 'hover:red10' })
    expect(text.assessments).toEqual([])
  })

  test('keeps an erased component type in the unknown-host review list', () => {
    const site = only(
      run(`import type React from 'react'
import { View as Raw } from 'tamagui'
const Box = Raw as React.ComponentType<any>
export const Fixture = () => <Box bg="$red10" hoverStyle={{ bg: '$blue10' }} />`)
    )

    expect(programs(site)).toEqual({ bg: 'red10 hover:blue10' })
    expect(site.after).not.toContain('hoverStyle=')
    expect(site.assessmentVerdict).toBe('unknown-host')
  })

  test('a host typed by onlyAllowShorthands still accepts the longhand it hides', () => {
    // `onlyAllowShorthands: true` omits every longhand a shorthand covers from
    // the component's prop type, so a real app's `View` types `rounded` and not
    // `borderRadius`. The conversion resolves `rounded` to its longhand before
    // asking the host, and the host answers about the property, not the spelling.
    const site = only(
      run(`import { View as Raw } from 'tamagui'
type ShorthandOnly = ((props: {
  rounded?: string
  px?: string
  overflow?: string
}) => null) & { staticConfig: {} }
const Card = Raw as unknown as ShorthandOnly
export const Fixture = () => <Card rounded="$3" px="$2" overflow="hidden" />`)
    )

    expect(site.assessments).toEqual([])
    expect(site.assessmentVerdict).toBe('clean')
  })

  test('a supported exit clause keeps an erased component in unknown-host review', () => {
    const site = only(
      run(`import type React from 'react'
import { View as Raw } from 'tamagui'
const Box = Raw as React.ComponentType<any>
export const Fixture = () => <Box exitStyle={{ opacity: 0 }} />`)
    )

    expect(programs(site)).toEqual({ opacity: 'exit:0' })
    expect(site.assessmentVerdict).toBe('unknown-host')
    expect(site.assessments).toContainEqual({
      property: 'opacity',
      verdict: 'unknown-host',
      reasons: expect.arrayContaining([expect.objectContaining({ dimension: 'host' })]),
    })
  })
})

describe('authored order', () => {
  test('a program merges across a spread it never crosses', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = (props) => (
        <View {...props} bg="$blue10" hoverStyle={{ bg: 'red' }} />
      )`)
    )

    expect(codes(site)).toEqual([])
    expect(site.after).toBe('{...props} bg="blue10 hover:red"')
  })

  test('a condition after a spread stays authored rather than moving before it', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = (props) => (
        <View bg="$blue10" {...props} hoverStyle={{ bg: 'red' }} />
      )`)
    )

    expect(codes(site)).toEqual(['condition-order-not-preservable'])
    // the condition stays after the spread while the base-only program can migrate
    expect(site.after).toBe(`bg="blue10" {...props} hoverStyle={{ bg: 'red' }}`)
  })

  test('an object literal spread is the same thing as writing its properties', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View {...{ '$sm': { bg: 'blue' } }} bg="$red10" />
      )`)
    )

    expect(codes(site)).toEqual([])
    // one program, printed base first, evaluated by clause order
    expect(programs(site)).toEqual({ bg: 'red10 sm:blue' })
    expect(resolve1('red10 sm:blue', {})).toBe('red10')
    expect(resolve1('red10 sm:blue', { media: ['sm'] })).toBe('blue')
  })

  test('a condition object left authored blocks merging the conditions after it', () => {
    const site = only(
      run(`import { Text, TextInput, View, styled } from 'tamagui'
export const Fixture = () => (
        <View
          bg="$blue10"
          pressStyle={{ bg: 'black' }}
          $group-card={{ bg: 'red' }}
          hoverStyle={{ bg: 'yellow' }}
        />
      )`)
    )

    expect(codes(site)).toContain('condition-order-not-preservable')
    expect(programs(site)).toEqual({ bg: 'blue10 press:black' })
    expect(site.after).toContain("hoverStyle={{ bg: 'yellow' }}")
  })
})

describe('styled variants', () => {
  test('each static variant branch converts as its own style object', () => {
    const result = run(`import { Text, TextInput, View, styled } from 'tamagui'
	const Frame = styled(Text, {
      color: 'black',
      variants: {
        size: {
          small: { color: '$red10', hoverStyle: { color: '$blue10' } },
          large: { padding: '$4' },
        },
      } as const,
    })`)

    const small = labeled(result, 'variants.size.small')
    expect(codes(small)).toEqual([])
    expect(programs(small)).toEqual({ color: 'red10 hover:blue10' })
    const large = labeled(result, 'variants.size.large')
    expect(programs(large)).toEqual({ padding: '4' })
    expect(pendingCodes(large)).toEqual([])
  })

  test('a variant branch does not invent a base for the outer program', () => {
    const site = labeled(
      runOn([
        fixture(
          `import { Text, TextInput, View, styled } from 'tamagui'
	const Frame = styled(View, {
        x: 0,
        variants: {
          going: styled.dynamic<number>((going) => ({ exitStyle: { x: going < 0 ? 100 : -100 } })),
        } as const,
      })`,
          'fixture.native.tsx'
        ),
      ]),
      'variants.going'
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({ x: 'exit:${going < 0 ? 100 : -100}px' })
    expect(resolve1('exit:100px', {})).toBe(null)
  })

  test('write mode converts flat values before wrapping a v2 function key', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  x: 0,
  variants: {
    going: {
      ':number': (going) => ({
        exitStyle: { x: going < 0 ? 100 : -100 },
      }),
    },
  } as const,
})`)

    expect(output).toContain('going: styled.dynamic<number>')
    expect(output).not.toContain("':number'")
    expect(output).not.toContain('exitStyle')
    expect(output).toContain('exit:${going < 0 ? 100 : -100}px')
  })
})

describe('functional variants', () => {
  test('spread keys become typed dynamics and add their type to the styled import', () => {
    const output = runWrite(`import { View, styled } from '@tamagui/core'
const Frame = styled(View, {
  variants: {
    size: {
      '...size': (val, extras) => ({
        width: extras.tokens.size[val],
        color: extras.theme.color,
      }),
    },
  } as const,
})
`)

    expect(output).toContain('type SizeTokens')
    expect(output).toContain("from '@tamagui/core'")
    expect(output).toContain('size: styled.dynamic<SizeTokens>((val, env) => ({')
    expect(output).toContain('width: env.tokens.size[val]')
    expect(output).toContain('color: env.theme.color')
    expect(output).toContain('} as const')
    expect(output).not.toContain("'...size'")
  })

  test.each([
    ['size', 'SizeTokens'],
    ['space', 'SpaceTokens'],
    ['color', 'ColorTokens'],
    ['radius', 'RadiusTokens'],
    ['fontSize', 'FontSizeTokens'],
    ['zIndex', 'ZIndexTokens'],
  ])('maps ...%s to %s', (category, typeName) => {
    const site = onlyFunctional(
      run(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    value: { '...${category}': (value, { tokens }) => ({ width: tokens.size[value] }) },
  } as const,
})`)
    )

    expect(site.flags).toEqual([])
    expect(site.after).toContain(`styled.dynamic<${typeName}>`)
  })

  test('a destructured env stays destructured and an existing type import is reused', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
import type { FontSizeTokens } from 'tamagui'
const Frame = styled(View, {
  variants: {
    size: { '...fontSize': (val, { tokens, font }) => ({ fontSize: tokens.size[val], lineHeight: font?.lineHeight[val] }) },
  } as const,
})`)

    expect(output.match(/FontSizeTokens/g)).toHaveLength(2)
    expect(output).toContain(
      'styled.dynamic<FontSizeTokens>((val, { tokens, font }) => ({'
    )
  })

  test('an env parameter with a shadowed name is left alone', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    size: {
      '...size': (val, extras) => {
        const read = (extras) => extras.tokens
        return { width: extras.tokens.size[val], height: read(extras) }
      },
    },
  } as const,
})`)

    expect(output).toContain('styled.dynamic<SizeTokens>((val, extras) => {')
    expect(output).toContain('width: extras.tokens.size[val]')
  })

  test('different type-key object returns form one canonical union', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    amount: {
      ':string': (amount) => ({ width: amount }),
      ':number': (amount) => ({ width: amount }),
      ':boolean': (amount) => ({ width: amount ? 1 : 0 }),
    },
  } as const,
})`)

    expect(output).toContain('styled.dynamic<number | string | boolean>')
    expect(output).toContain("if (typeof value === 'number')")
    expect(output).toContain("if (typeof value === 'string')")
    expect(output).toContain('return { width: value ? 1 : 0 }')
    expect(output).not.toContain("':number'")
  })

  test('combined type-key object returns preserve as const assertions', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    amount: {
      ':number': (amount) => ({ width: amount } as const),
      ':string': (amount) => {
        return { width: amount } as const
      },
    },
  } as const,
})`)

    expect(output.match(/as const/g)).toHaveLength(3)
    expect(output).toContain('return ({ width: value } as const)')
    expect(output).toContain('return { width: value } as const')
  })

  test('several type keys with the same body do not add typeof branches', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    amount: {
      ':number': (amount) => ({ width: amount }),
      ':string': (amount) => ({ width: amount }),
    },
  } as const,
})`)

    expect(output).toContain('styled.dynamic<number | string>((value) =>')
    expect(output).toContain('{ width: value }')
    expect(output).not.toContain('typeof value')
  })

  test('combined type bodies map both extras forms onto env', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    amount: {
      ':number': (amount, { tokens }) => ({ width: tokens.size[amount] }),
      ':string': (amount, extras) => ({ color: extras.theme[amount] }),
    },
  } as const,
})`)

    expect(output).toContain('styled.dynamic<number | string>((value, env) =>')
    expect(output).toContain('return { width: env.tokens.size[value] }')
    expect(output).toContain('return { color: env.theme[value] }')
  })

  test('different non-object type bodies are flagged and left authored', () => {
    const source = `import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    amount: {
      ':number': (amount) => makeNumberStyles(amount),
      ':string': (amount) => ({ width: amount }),
    },
  } as const,
})`
    const site = onlyFunctional(run(source))

    expect(site.flags.map((flag) => flag.code)).toEqual([
      'functional-variant-type-bodies',
    ])
    expect(runWrite(source)).toContain("':number':")
  })

  test('catch-all keys report the exact line and suggested generic without rewriting', () => {
    const source = `import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    tone: {
      '...': (value) => ({ opacity: value ? 1 : 0 }),
    },
  } as const,
})`
    const site = onlyFunctional(run(source))

    expect(site.line).toBe(5)
    expect(site.flags).toEqual([
      expect.objectContaining({
        code: 'functional-variant-catch-all',
        detail: expect.stringContaining('styled.dynamic<YourValue>'),
      }),
    ])
    expect(runWrite(source)).toContain("'...':")
  })

  test('mixed exact and functional branches are flagged and not rewritten', () => {
    const source = `import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    amount: {
      small: { width: 10 },
      ':number': (amount) => ({ width: amount }),
    },
  } as const,
})`
    const site = onlyFunctional(run(source))

    expect(site.flags.map((flag) => flag.code)).toEqual(['functional-variant-mixed'])
    expect(runWrite(source)).toContain("':number':")
  })

  test('extras.props produces a resolve draft and leaves the functional key authored', () => {
    const source = `import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    size: {
      '...size': (val, extras) => ({
        width: extras.props.fullscreen ? extras.tokens.size[val] : val,
      }),
    },
  } as const,
})`
    const site = onlyFunctional(run(source))

    expect(site.flags.map((flag) => flag.code)).toEqual([
      'functional-variant-needs-resolve',
    ])
    expect(site.draft).toContain('.resolve((props, env) =>')
    expect(site.draft).toContain('const val = props.size')
    expect(site.draft).toContain('props.fullscreen')
    expect(site.draft).toContain('env.tokens.size[val]')
    expect(runWrite(source)).toContain("'...size':")
  })

  test('destructured props reads produce the same resolve flag and draft', () => {
    const site = onlyFunctional(
      run(`import { View, styled } from 'tamagui'
const Frame = styled(View, {
  variants: {
    size: {
      '...size': (val, { props, theme }) => ({ color: props.active ? theme.color : val }),
    },
  } as const,
})`)
    )

    expect(site.flags.map((flag) => flag.code)).toEqual([
      'functional-variant-needs-resolve',
    ])
    expect(site.draft).toContain('props.active')
    expect(site.draft).toContain('env.theme.color')
  })

  test('the functional summary counts automatic conversions and flags by category', () => {
    const result = run(`import { View, styled } from 'tamagui'
const A = styled(View, { variants: { size: { '...size': (value) => ({ width: value }) } } })
const B = styled(View, { variants: { tone: { '...': (value) => ({ opacity: value }) } } })`)

    expect(result.summary.functionalVariantSites).toBe(2)
    expect(result.summary.functionalVariantConverted).toBe(1)
    expect(result.summary.functionalVariantFlagged).toBe(1)
    expect(result.summary.functionalVariantFlags).toEqual({
      'functional-variant-catch-all': 1,
    })
  })
})

describe('token context', () => {
  test('a "$" inside an unquoted url() body is literal CSS and is never rewritten', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = () => (
          <View backgroundImage="url($asset)" hoverStyle={{ backgroundImage: 'none' }} />
        )`)
    )

    // the url body is not a token candidate, so there is nothing to convert here
    // and the value has to survive the pass byte for byte
    expect(site.after).toContain('backgroundImage="url($asset)"')
    expect(programs(site)).toEqual({})
    expect(codes(site)).toContain('unsupported-legacy-value')
  })

  test('a "$" inside a quoted string is left alone too', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = () => (
          <View content="'$4'" hoverStyle={{ content: "''" }} />
        )`)
    )

    expect(site.after).toContain(`content="'$4'"`)
    expect(programs(site)).toEqual({})
    expect(codes(site)).toContain('unsupported-legacy-value')
  })

  test('a token candidate outside those contexts still converts', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = () => (
          <View
            backgroundImage="linear-gradient(135deg, $accent, blue)"
            hoverStyle={{ backgroundImage: 'none' }}
          />
        )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      backgroundImage: 'linear-gradient(135deg, accent, blue) hover:none',
    })
  })

  test('a rewritten expression obeys the same contexts', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = ({ active }) => (
          <View
            backgroundImage={active ? 'url($a)' : 'url($b)'}
            hoverStyle={{ backgroundImage: 'none' }}
          />
        )`)
    )

    expect(codes(site)).toContain('unsupported-legacy-value')
    expect(site.after).toContain(`active ? 'url($a)' : 'url($b)'`)
    expect(programs(site)).toEqual({})
  })

  test('a template literal converts its own chunks, not just the head', () => {
    const site = only(
      run(`import { Text } from 'tamagui'
        export const Fixture = ({ n }) => (
          <Text color={\`$accent\${n}\`} hoverStyle={{ color: 'red' }} />
        )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site).color).toBe('${`accent${n}`} hover:red')
  })
})

describe('authored order across an inline object spread', () => {
  test('a nested spread is preserved and blocks the merge across it', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = (props) => (
          <View
            {...{
              bg: '$blue10',
              ...props,
              hoverStyle: { bg: 'red' },
            }}
          />
        )`)
    )

    // `...props` can set bg, so merging hover onto the base would let the spread
    // lose where it used to win
    expect(codes(site)).toEqual(['condition-order-not-preservable'])
    expect(site.after).toContain('{...props}')
    expect(site.after).toContain(`hoverStyle={{ bg: 'red' }}`)
    expect(programs(site)).toEqual({ bg: 'blue10' })
  })

  test('a nested spread inside a styled config is preserved too', () => {
    const site = labeled(
      run(`import { View, styled } from 'tamagui'
        const base = { bg: 'gray' }
        const Frame = styled(View, {
          ...{
            bg: '$blue10',
            ...base,
            hoverStyle: { bg: 'red' },
          },
        })`),
      'styled(View'
    )

    expect(codes(site)).toEqual(['condition-order-not-preservable'])
    expect(site.after).toContain('...base')
    expect(site.after).toContain(`hoverStyle: { bg: 'red' }`)
  })

  test('a spread the conversion cannot open is flagged for the legacy keys it hides', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = ({ wide }) => (
          <View
            bg="$blue10"
            minWidth={wide ? undefined : 160}
            {...(!wide && {
              $sm: { minWidth: '40%' },
              $lg: { minWidth: '10%' },
            })}
          />
        )`)
    )

    expect(codes(site)).toEqual(['legacy-condition-in-spread'])
    expect(site.flags[0].detail).toContain('$sm')
    expect(site.flags[0].detail).toContain('$lg')
    expect(site.after).toContain("$sm: { minWidth: '40%' }")
  })

  test('a preserved legacy spread counts as a hand edit, not as converted', () => {
    const sourcePath = fixture(`import { View } from 'tamagui'
export const Fixture = ({ wide }) => (
  <View {...(!wide && { $sm: { minWidth: '40%' } })} />
)`)
    const result = runRaw([sourcePath])
    expect(result.exitCode, result.stderr).toBe(0)
    const report = readFileSync(result.reportPath, 'utf8')

    const site = only(runOn([sourcePath]))
    expect(site.legacyLeft).toBe(1)
    expect(report).toContain('- 0 converted with no open questions')
    expect(report).toContain('- 1 have syntax or ordering flags for manual work')
    expect(report).toContain('0 of 1 files have no legacy condition object')
  })

  test('a member whose key is not statically known is kept as a barrier', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = ({ key }) => (
          <View {...{ bg: '$blue10', [key]: 1, hoverStyle: { bg: 'red' } }} />
        )`)
    )

    expect(codes(site)).toEqual(['condition-order-not-preservable'])
    expect(site.after).toContain('[key]: 1')
  })
})

describe('nested custom media conditions', () => {
  test('a statically named nested condition is discovered and converted', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = () => (
          <View
            bg="$blue10"
            $sm={{ '$future-condition': { bg: 'red' } }}
            hoverStyle={{ bg: 'yellow' }}
          />
        )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      bg: 'blue10 sm:future-condition:red hover:yellow',
    })
    expect(site.after).not.toContain('$sm')
    expect(site.after).not.toContain('hoverStyle')
  })

  test('a nested custom media clause composes beside another property program', () => {
    const site = only(
      run(`import { View } from 'tamagui'
        export const Fixture = () => (
          <View
            opacity={0.5}
            $sm={{ '$future-condition': { bg: 'red' } }}
            hoverStyle={{ opacity: 1 }}
          />
        )`)
    )

    expect(codes(site)).toEqual([])
    expect(programs(site)).toEqual({
      opacity: '0.5 hover:1',
      bg: 'sm:future-condition:red',
    })
    expect(resolve1('0.5 hover:1', { states: ['hover'] })).toBe('1')
  })
})

describe('group containers', () => {
  test('only the tree that actually wraps the consumer declares the container', () => {
    const result = run(`import { View } from 'tamagui'
      export const One = () => (
        <View group="card">
          <View bg="red" />
        </View>
      )
      export const Two = () => (
        <View group="card">
          <View bg="red" $group-card-maxMd={{ bg: 'blue' }} />
        </View>
      )`)

    const found = sites(result)
    expect(found.length).toBe(2)
    const [card, inner] = found
    // the unrelated tree is not a conversion site at all: nothing there changes
    expect(card.line).toBe(8)
    expect(card.after).toBe(`group="card" container="card"`)
    expect(codes(card)).toEqual([])

    expect(codes(inner)).toEqual([])
    expect(programs(inner)).toEqual({ bg: 'red @max-md/card:blue' })
    expect(resolve1('red @max-md/card:blue', { containers: ['@max-md/card'] })).toBe(
      'blue'
    )
  })

  test('two candidate declarations leave the condition authored', () => {
    const result = run(`import { Text, View, styled } from 'tamagui'
      const Card = styled(View, { group: 'card' })
      const Inner = styled(Text, {
        color: 'black',
        '$group-card-maxMd': { color: 'red' },
      })
      export const Fixture = () => (
        <View group="card">
          <Card>
            <Inner />
          </Card>
        </View>
      )`)

    const inner = labeled(result, 'styled(Text, …)')
    expect(codes(inner)).toEqual(['ambiguous-container-group'])
    // converting would emit a container query with no container this pass can place
    expect(programs(inner)).toEqual({})
    expect(inner.after).toContain(`'$group-card-maxMd': { color: 'red' }`)
    // and no element silently grows a container
    for (const site of sites(result)) expect(site.after).not.toContain('container')
  })

  test('a group nobody declares in the file is reported, not converted', () => {
    const site = labeled(
      run(`import { Text, View, styled } from 'tamagui'
        const Inner = styled(Text, {
          color: 'black',
          '$group-card-maxMd': { color: 'red' },
        })`),
      'styled(Text'
    )

    expect(codes(site)).toEqual(['container-group-not-declared'])
    expect(programs(site)).toEqual({})
  })
})

describe('Tamagui provenance', () => {
  test('another library’s styled and a non-Tamagui tag are left alone', () => {
    const result = run(`import styled from '@emotion/styled'
      import { View as RNView } from 'react-native'
      import { View } from 'tamagui'

      const localStyled = (component: any, config: any) => component

      export const Emotion = styled(View, {
        color: '$brand',
        hoverStyle: { color: '$brandHover' },
      })
      export const Local = localStyled(View, {
        color: '$brand',
        hoverStyle: { color: '$brandHover' },
      })
      export const Native = () => <RNView bg="$blue10" hoverStyle={{ bg: 'red' }} />
      export const Intrinsic = () => <div bg="$blue10" hoverStyle={{ bg: 'red' }} />
      export const Real = () => <View bg="$blue10" hoverStyle={{ bg: 'red' }} />`)

    const found = sites(result)
    expect(found.map((site) => site.label)).toEqual(['<View>'])
    expect(programs(found[0])).toEqual({ bg: 'blue10 hover:red' })
  })

  test('provenance follows a re-export chain and a local alias', () => {
    const directory = dirname(
      fixture(`import { View } from 'tamagui'
        export { View }`)
    )
    const barrel = join(directory, 'barrel.tsx')
    writeFileSync(barrel, `export { View } from './fixture'\n`)
    const consumer = join(directory, 'consumer.tsx')
    writeFileSync(
      consumer,
      `import { View as Raw } from './barrel'
      const Box = Raw
      export const Fixture = () => <Box bg="$blue10" hoverStyle={{ bg: 'red' }} />\n`
    )

    const site = only(runOn([consumer]))
    expect(programs(site)).toEqual({ bg: 'blue10 hover:red' })
  })
})

describe('inputs', () => {
  test('write mode applies safe JSX and styled conversions in place', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
export const Box = styled(View, {
  bg: '$blue10',
  hoverStyle: {
    // the comment must survive when the condition object becomes a clause
    bg: '$red10',
  },
})
export const Fixture = () => <Box opacity={1} pressStyle={{ opacity: 0.5 }} />
`)

    expect(output).toContain('bg: "blue10 hover:red10"')
    expect(output).toContain('opacity="1 press:0.5"')
    expect(output).toContain(
      '// the comment must survive when the condition object becomes a clause'
    )
    expect(output).not.toContain('hoverStyle')
    expect(output).not.toContain('pressStyle')
  })

  test('write mode preserves V2 pseudo priority when objects overlap', () => {
    const output = runWrite(`import { View, styled } from 'tamagui'
export const Box = styled(View, {
  bg: '$background',
  focusStyle: { bg: 'red' },
  pressStyle: { bg: 'blue' },
  hoverStyle: { bg: 'green' },
})
`)

    expect(output).toContain('bg: "background hover:green press:blue focus:red"')
  })

  test('an ignore marker protects a pinned compatibility fixture from write mode', () => {
    const directory = mkdtempSync(join(packageDir, 'test/.flat-values-fixture-'))
    temporaryDirectories.push(directory)
    writeFileSync(join(directory, '.tamagui-flat-values-ignore'), 'Pinned V2 fixture.\n')
    const sourcePath = join(directory, 'fixture.tsx')
    const source = `import { View } from 'tamagui'
export const Fixture = () => <View bg="$blue10" hoverStyle={{ bg: '$blue11' }} />
`
    writeFileSync(sourcePath, source)

    const reportDirectory = mkdtempSync(join(tmpdir(), 'flat-values-ignore-'))
    temporaryDirectories.push(reportDirectory)
    const result = Bun.spawnSync({
      cmd: [
        process.execPath,
        entry,
        '--write',
        '--report',
        join(reportDirectory, 'report.md'),
        directory,
      ],
      cwd: repoRoot,
      stderr: 'pipe',
      stdout: 'pipe',
    })

    expect(result.exitCode).toBe(2)
    expect(result.stderr.toString()).toContain(
      'all 1 matched source file was skipped by .tamagui-flat-values-ignore'
    )
    expect(existsSync(join(reportDirectory, 'report.md'))).toBe(false)
    expect(readFileSync(sourcePath, 'utf8')).toBe(source)
  })

  test('ignored files are counted when the corpus also has migration input', () => {
    const directory = mkdtempSync(join(packageDir, 'test/.flat-values-fixture-'))
    temporaryDirectories.push(directory)
    const ignoredDirectory = join(directory, 'pinned-v2')
    const includedDirectory = join(directory, 'app')
    mkdirSync(ignoredDirectory, { recursive: true })
    mkdirSync(includedDirectory, { recursive: true })
    writeFileSync(
      join(ignoredDirectory, '.tamagui-flat-values-ignore'),
      'Pinned V2 fixture.\n'
    )
    writeFileSync(
      join(ignoredDirectory, 'fixture.tsx'),
      `import { View } from 'tamagui'\nexport const Fixture = () => <View bg="$blue10" />\n`
    )
    writeFileSync(
      join(includedDirectory, 'fixture.tsx'),
      `import { View } from 'tamagui'\nexport const Fixture = () => <View bg="$blue10" />\n`
    )

    const result = runOn([directory])

    expect(result.summary.ignoredFiles).toBe(1)
    expect(result.files).toHaveLength(1)
  })

  test('write mode preserves a line comment before JSX style attributes', () => {
    const output = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    // @ts-expect-error migration fixture
    bg="$blue10"
    hoverStyle={{ bg: 'red' }}
  />
)
`)

    expect(output).toMatch(
      /\/\/ @ts-expect-error migration fixture\n\s+bg="blue10 hover:red"/
    )
    expect(output).not.toContain('hoverStyle')
  })

  test('write mode converts nested JSX from the leaves upward', () => {
    const output = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View bg="$blue10" hoverStyle={{ bg: 'red' }}>
    <View p="$2" pressStyle={{ p: '$3' }} />
  </View>
)
`)

    expect(output).toContain('bg="blue10 hover:red"')
    expect(output).toContain('p="2 press:3"')
    expect(output).not.toContain('hoverStyle')
    expect(output).not.toContain('pressStyle')
  })

  test('write mode preserves ASI-sensitive statements inside a JSX spread', () => {
    const output = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View
    bg="$blue10"
    hoverStyle={{ bg: 'red' }}
    {...{
      onPress() {
        one()
        two()
      },
    }}
  />
)
`)

    expect(output).toContain('bg="blue10 hover:red"')
    expect(output).toContain('one()\n')
    expect(output).toContain('two()')
  })

  test('write mode discovers custom media names from the migration corpus', () => {
    const output = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View display="flex" $gtSmall={{ display: 'none' }} />
)
`)

    expect(output).toContain('display="flex gtSmall:none"')
    expect(output).not.toContain('$gtSmall')
  })

  test('bare legacy platform conditions are not discovered as custom media', () => {
    const output = runWrite(`import { View } from 'tamagui'
export const Fixture = () => (
  <View display="flex" $web={{ display: 'none' }} />
)
`)

    expect(output).toContain('display="flex web:none"')
    expect(output).not.toContain('$web')
  })

  test('an input that matches no file exits nonzero and writes no report', () => {
    const result = runRaw([join(tmpdir(), 'flat-values-does-not-exist.tsx')])

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('no source file matched')
    // a typo must never render as "every file in this corpus is ready"
    expect(existsSync(result.reportPath)).toBe(false)
  })

  test('a real input still writes its report', () => {
    const result = runRaw([
      fixture(`import { View } from 'tamagui'
        export const Fixture = () => <View bg="$blue10" hoverStyle={{ bg: 'red' }} />`),
    ])

    expect(result.exitCode).toBe(0)
    expect(readFileSync(result.reportPath, 'utf8')).toContain('bg="blue10 hover:red"')
  })
})

describe('the kitchen-sink corpus', () => {
  test('the migrated default corpus has no v1 conversion sites', () => {
    const result = runOn(defaultCorpus)
    expect(result.summary.sites).toBe(0)

    const legacyNames = [
      'hoverStyle',
      'pressStyle',
      'focusStyle',
      'focusVisibleStyle',
      'enterStyle',
      'exitStyle',
      'disabledStyle',
      '$theme-',
      '$web=',
      '$group-',
    ]
    const offenders: string[] = []

    for (const file of result.files) {
      for (const site of file.sites) {
        for (const flag of site.flags) {
          // the printer verifies itself by re-parsing; these two can never be real
          expect(flag.code).not.toBe('emitted-program-mismatch')
          expect(flag.code).not.toBe('emitted-value-invalid')
        }
        for (const program of site.programs) {
          const text = sanitize(program.value)
          if (!parseValue(text, registry).ok) {
            offenders.push(`${file.file}:${site.line} ${program.name}="${text}"`)
          }
          if (/(^|[\s(,/])\$/.test(text)) {
            offenders.push(`${file.file}:${site.line} kept a token: ${program.value}`)
          }
        }
        if (site.flags.length || site.assessmentVerdict !== 'clean') continue
        for (const name of legacyNames) {
          if (site.after.includes(name)) {
            offenders.push(`${file.file}:${site.line} kept ${name}: ${site.after}`)
          }
        }
      }
    }

    expect(offenders).toEqual([])
  }, 180_000)
})

describe('multi-line elements', () => {
  test('a rewritten element keeps one attribute per line at the authored indentation', () => {
    const written = runWrite(`import { View } from 'tamagui'

export function Example() {
  return (
    <View>
      <View
        bg="$red"
        hoverStyle={{ bg: '$blue' }}
        onPress={() => {}}
      >
        <View
          p="$4"
          $sm={{ p: '$6' }}
        />
      </View>
    </View>
  )
}
`)
    expect(written).toBe(`import { View } from 'tamagui'

export function Example() {
  return (
    <View>
      <View
        bg="red hover:blue"
        onPress={() => {}}
      >
        <View
          p="4 sm:6"
        />
      </View>
    </View>
  )
}
`)
  })
})

describe('Sheet anatomy', () => {
  test('a Frame becomes a Container with a Background carrying the surface props', () => {
    const written = runWrite(`import { Sheet } from 'tamagui'

export function Example({ children }) {
  return (
    <Sheet>
      <Sheet.Overlay />
      <Sheet.Frame padding="$4" bg="$background" borderRadius="$6" gap="$2">
        <Sheet.ScrollView>{children}</Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
`)
    expect(written).toBe(`import { Sheet } from 'tamagui'

export function Example({ children }) {
  return (
    <Sheet>
      <Sheet.Overlay />
      <Sheet.Container padding="4" gap="2">
        <Sheet.Background bg="background" borderRadius="6" />
        <Sheet.ScrollView>{children}</Sheet.ScrollView>
      </Sheet.Container>
    </Sheet>
  )
}
`)
  })

  test('a multi-line Frame keeps one attribute per line and an existing Background takes the moved props', () => {
    const written = runWrite(`import { Sheet } from 'tamagui'

export function Example({ children }) {
  return (
    <Sheet>
      <Sheet.Frame
        padding={16}
        borderColor="$borderColor"
        maxHeight={400}
      >
        <Sheet.Background bg="$color2" />
        {children}
      </Sheet.Frame>
      <Sheet.Frame bg="$background" {...rest} />
    </Sheet>
  )
}
`)
    expect(written).toBe(`import { Sheet } from 'tamagui'

export function Example({ children }) {
  return (
    <Sheet>
      <Sheet.Container
        padding={16}
        maxHeight={400}
      >
        <Sheet.Background bg="color2" borderColor="border-color" />
        {children}
      </Sheet.Container>
      <Sheet.Container {...rest}><Sheet.Background bg="background" /></Sheet.Container>
    </Sheet>
  )
}
`)
  })

  test('adapted sheets, styled targets, and foreign Sheets are told apart', () => {
    const source = `import { Dialog, styled } from 'tamagui'
import { Sheet } from './local-sheet'

const Frame = styled(Dialog.Sheet.Frame, { padding: 16 })

export function Example() {
  return (
    <>
      <Dialog.Sheet.Frame padding="$4"><Dialog.Sheet.ScrollView /></Dialog.Sheet.Frame>
      <Sheet.Frame bg="$background" />
    </>
  )
}
`
    const result = run(source)
    const [styledTarget, element] = result.files[0]!.sheetFrames
    expect(result.summary.sheetFrames).toBe(2)
    expect(result.summary.sheetFramesFlagged).toBe(1)
    expect(styledTarget!.label).toBe('styled(Dialog.Sheet.Frame, …)')
    expect(styledTarget!.flags.map((flag) => flag.code)).toEqual(['sheet-frame-styled'])
    expect(element!.label).toBe('<Dialog.Sheet.Frame>')
    expect(element!.after).toBe(
      '<Dialog.Sheet.Container padding="$4"><Dialog.Sheet.Background /><Dialog.Sheet.ScrollView /></Dialog.Sheet.Container>'
    )
    expect(runWrite(source)).toBe(`import { Dialog, styled } from 'tamagui'
import { Sheet } from './local-sheet'

const Frame = styled(Dialog.Sheet.Container, { padding: 16 })

export function Example() {
  return (
    <>
      <Dialog.Sheet.Container padding="4"><Dialog.Sheet.Background /><Dialog.Sheet.ScrollView /></Dialog.Sheet.Container>
      <Sheet.Frame bg="$background" />
    </>
  )
}
`)
  })
})

describe('token variant props', () => {
  const source = `import { Button, Input, ListItem, Spacer, YStack, styled } from 'tamagui'
import { Search } from '@tamagui/lucide-icons'
import { Local } from './local'

export const Big = styled(Button, {
  size: '$5',
  // the icon leads
  iconSize: '$3',
  defaultVariants: {
    size: '$6',
  },
  variants: {
    huge: {
      true: { size: '$8' },
    },
  } as const,
})

export function Example({ compact }: { compact: boolean }) {
  return (
    <YStack elevation="$2" gap="$true">
      <Button size="$4" elevation="$true" icon={<Search size="$4" />} />
      <Button size={compact ? '$3' : '$true'} />
      <Button size={'$size.4'} />
      <Spacer size="$1.5" />
      <ListItem iconSize="$2" size="4" />
      <Input placeholder="$100" size="$4" />
      <Local size="$4" />
    </YStack>
  )
}
`

  test('size tokens on size, elevation, and iconSize lose their $ everywhere they are spelled', () => {
    const written = runWrite(source)
    expect(written).toContain(`  size: '5',
  // the icon leads
  iconSize: '3',`)
    expect(written).toContain(`  defaultVariants: {
    size: '6'
  },`)
    expect(written).toContain(`size: '8'`)
    expect(written).toContain(`<YStack elevation="2" gap="4">`)
    expect(written).toContain(`<Button size="4" elevation icon={<Search size="4" />} />`)
    expect(written).toContain(`<Button size={compact ? '3' : true} />`)
    expect(written).toContain(`<Button size={'$size.4'} />`)
    expect(written).toContain(`<Spacer size="1-5" />`)
    expect(written).toContain(`<ListItem iconSize="2" size="4" />`)
    expect(written).toContain(`<Input placeholder="$100" size="4" />`)
    expect(written).toContain(`<Local size="$4" />`)
  })

  test('a respelled site counts as converted, a dot path is flagged, and $true on a style prop warns', () => {
    const result = run(source)
    const sites = result.files[0]!.sites
    const dotPath = sites.find((site) => site.before === `size={'$size.4'}`)!
    expect(dotPath.flags.map((flag) => flag.code)).toEqual(['legacy-token-dot-path'])
    const stack = sites.find((site) => site.label === '<YStack>')!
    expect(stack.warnings.map((flag) => flag.code)).toEqual(['legacy-true-token'])
    const button = sites.find((site) => site.before === 'size="$4" elevation="$true"')!
    expect(button.warnings).toEqual([])
    expect(button.programs).toEqual([
      { name: 'size', value: '"4"', dynamic: false },
      { name: 'elevation', value: 'true', dynamic: false },
    ])
    expect(result.summary.waiting).toBe(0)
    expect(result.summary.flagged).toBe(1)
  })
})
