const { execFileSync } = require('node:child_process')
const { existsSync, mkdtempSync, renameSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { basename, join, normalize } = require('node:path')

const compilerFixtures = [
  {
    testFile: 'e2e/CompilerExtraction.test.ts',
    sourceFile: 'src/usecases/CompilerExtraction.tsx',
    nativeFile: 'src/usecases/CompilerExtraction.native.tsx',
    // calibrated to plan.stats.flattened — the old 18 counted _withStableStyle
    // wrapper strings, which the plan-based counter replaced
    extraArgs: ['--expect-optimizations', '8'],
  },
  {
    testFile: 'e2e/CompilerTernaryActive.test.ts',
    sourceFile: 'src/usecases/CompilerTernaryActive.tsx',
    nativeFile: 'src/usecases/CompilerTernaryActive.native.tsx',
    extraArgs: [],
  },
  {
    testFile: 'e2e/NativeRegistryCorrectness.test.ts',
    sourceFile: 'src/usecases/NativeRegistryCorrectnessCase.tsx',
    nativeFile: 'src/usecases/NativeRegistryCorrectnessCase.native.tsx',
    extraArgs: [],
    env: { TAMAGUI_NATIVE_FAST_PATH: '1' },
  },
]

const projectRoot = join(__dirname, '..')

function normalizeTestPath(testFile) {
  return normalize(testFile).replace(/\\/g, '/')
}

function getSelectedTestFiles() {
  const envTestFiles = (process.env.TAMAGUI_DETOX_TEST_FILES || '')
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (envTestFiles.length > 0) {
    return envTestFiles.map(normalizeTestPath)
  }

  return process.argv.filter((entry) => entry.endsWith('.test.ts')).map(normalizeTestPath)
}

function getTestNamePattern() {
  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i]

    if (arg === '-t' || arg === '--testNamePattern') {
      return process.argv[i + 1] || ''
    }

    if (arg.startsWith('--testNamePattern=')) {
      return arg.slice('--testNamePattern='.length)
    }
  }

  return ''
}

function testNamePatternMatchesFixture(testNamePattern, fixture) {
  const fixtureName = basename(fixture.testFile, '.test.ts')

  try {
    return new RegExp(testNamePattern, 'i').test(fixtureName)
  } catch {
    return fixtureName.toLowerCase().includes(testNamePattern.toLowerCase())
  }
}

function getCompilerFixturesForSelectedTests() {
  const selectedTestFiles = getSelectedTestFiles()

  if (selectedTestFiles.length > 0) {
    return compilerFixtures.filter((fixture) => {
      const fixturePath = normalizeTestPath(fixture.testFile)
      const fixtureName = basename(fixturePath)

      return selectedTestFiles.some(
        (testFile) => testFile.endsWith(fixturePath) || basename(testFile) === fixtureName
      )
    })
  }

  const testNamePattern = getTestNamePattern()

  if (testNamePattern) {
    return compilerFixtures.filter((fixture) =>
      testNamePatternMatchesFixture(testNamePattern, fixture)
    )
  }

  return compilerFixtures
}

function buildCompilerFixturesForSelectedTests() {
  const selectedFixtures = getCompilerFixturesForSelectedTests()

  if (selectedFixtures.length === 0) {
    return
  }

  console.info(
    `Building ${selectedFixtures.length} compiler fixture${
      selectedFixtures.length === 1 ? '' : 's'
    } for Detox...`
  )

  for (const fixture of selectedFixtures) {
    const nativePath = join(projectRoot, fixture.nativeFile)
    const outputDir = mkdtempSync(join(tmpdir(), 'tamagui-detox-compiler-'))
    const outputPath = join(outputDir, basename(fixture.sourceFile))

    const args = [
      '../core/cli/dist/index.cjs',
      'build',
      fixture.sourceFile,
      '--target',
      'native',
      '--output',
      outputDir,
      ...fixture.extraArgs,
    ]

    try {
      console.info(`Running: bun ${args.join(' ')}`)
      execFileSync('bun', args, {
        cwd: projectRoot,
        stdio: 'inherit',
        env: { ...process.env, ...fixture.env },
      })

      if (!existsSync(outputPath)) {
        throw new Error(
          `Expected compiler fixture was not generated: ${fixture.nativeFile}`
        )
      }
      renameSync(outputPath, nativePath)
    } finally {
      rmSync(outputDir, { recursive: true, force: true })
    }
  }
}

module.exports = {
  buildCompilerFixturesForSelectedTests,
}
