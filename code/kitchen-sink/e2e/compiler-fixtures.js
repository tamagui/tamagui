const { execFileSync } = require('node:child_process')
const { existsSync, unlinkSync } = require('node:fs')
const { basename, join, normalize } = require('node:path')

const compilerFixtures = [
  {
    testFile: 'e2e/CompilerExtraction.test.ts',
    sourceFile: 'src/usecases/CompilerExtraction.tsx',
    nativeFile: 'src/usecases/CompilerExtraction.native.tsx',
    extraArgs: ['--expect-optimizations', '18'],
  },
  {
    testFile: 'e2e/CompilerTernaryActive.test.ts',
    sourceFile: 'src/usecases/CompilerTernaryActive.tsx',
    nativeFile: 'src/usecases/CompilerTernaryActive.native.tsx',
    extraArgs: [],
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

    if (existsSync(nativePath)) {
      unlinkSync(nativePath)
    }

    const args = [
      'tamagui',
      'build',
      fixture.sourceFile,
      '--target',
      'native',
      '--output-around',
      ...fixture.extraArgs,
    ]

    console.info(`Running: npx ${args.join(' ')}`)
    execFileSync('npx', args, { cwd: projectRoot, stdio: 'inherit' })

    if (!existsSync(nativePath)) {
      throw new Error(
        `Expected compiler fixture was not generated: ${fixture.nativeFile}`
      )
    }
  }
}

module.exports = {
  buildCompilerFixturesForSelectedTests,
}
