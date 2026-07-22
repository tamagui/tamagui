import { readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const repoRoot = process.cwd()
const e2eDir = join(repoRoot, 'code/kitchen-sink/e2e')
const shouldWriteGitHubOutput = process.argv.includes('--github-output')

// 4 seed shards balanced by test execution time. The old ~7min/shard ts-jest
// type-check tax is gone (e2e now transpiles via e2e/tsconfig.json), so startup
// is small and these fit well under the native-ci runner's 45-minute process
// timeout. CompilerExtraction runs an in-test `npx tamagui build` (~12-19min,
// variable) so it gets its OWN shard (with the iOS-skipped
// SheetKeyboardDrag, which costs ~0, plus the small iOS-running
// SheetFitKeyboardSafeArea, ~1 launch); the remaining files are bin-packed to
// ~14.5min test-exec each (~25min wall). SelectAndroidOnPress is android-only
// and remains explicitly excluded below; it still runs in the android job.
const seedShards = [
  {
    name: '1/4',
    slug: '1-4',
    test_files:
      'e2e/Accordion.test.ts e2e/CompilerExtraction.test.ts e2e/SheetKeyboardDrag.test.ts e2e/SheetFitKeyboardSafeArea.test.ts e2e/SheetPressResponderSheetRngh.test.ts',
  },
  {
    name: '2/4',
    slug: '2-4',
    test_files:
      'e2e/PressStyleNative.noRngh.test.ts e2e/CompilerTernaryActive.test.ts e2e/TabsOnInteraction.test.ts e2e/PointerEvents.test.ts e2e/GroupPressNative.test.ts e2e/ShorthandVariables.test.ts e2e/check-rngh-status.test.ts',
  },
  {
    name: '3/4',
    slug: '3-4',
    test_files:
      'e2e/SheetScrollableDrag.test.ts e2e/ThemeMutation.test.ts e2e/NativePortal.test.ts e2e/GroupPressTransitionMatrix.test.ts e2e/MenuRadioGroup.test.ts e2e/PressStyleScrollStuck.test.ts e2e/NativeMixedDriver.test.ts',
  },
  {
    name: '4/4',
    slug: '4-4',
    test_files:
      'e2e/PressStyleNative.test.ts e2e/SheetPressRegression.test.ts e2e/SheetKeyboardFitContent.test.ts e2e/SelectRemount.test.ts e2e/SheetDragResist.test.ts e2e/ThemeChangeBasic.test.ts e2e/NestedPressExclusive.test.ts e2e/MediaQueryGtMd.test.ts',
  },
]

const explicitlyExcludedTests = new Map([
  // android-only: every test skips on iOS (device.getPlatform() === 'ios'), so running
  // it on the iOS sim produced zero coverage while burning ~6.6min. it still runs in the
  // android Detox job, which executes all e2e files unsharded.
  [
    'SelectAndroidOnPress.test.ts',
    'android-only (skips on iOS); runs in the android job',
  ],
])

const assignedTestFiles = seedShards.flatMap((shard) => splitTestFiles(shard.test_files))
const assignedTestBasenames = assignedTestFiles
  .filter((entry) => entry.endsWith('.test.ts'))
  .map((entry) => basename(entry))

const allDetoxTests = readdirSync(e2eDir)
  .filter((entry) => entry.endsWith('.test.ts'))
  .sort()

const counts = new Map()
for (const testName of assignedTestBasenames) {
  counts.set(testName, (counts.get(testName) ?? 0) + 1)
}

const duplicateAssignments = [...counts.entries()]
  .filter(([, count]) => count > 1)
  .map(([testName, count]) => `${testName} (${count}x)`)

const staleAssignments = assignedTestBasenames.filter(
  (testName) => !allDetoxTests.includes(testName)
)

const missingAssignments = allDetoxTests.filter(
  (testName) => !counts.has(testName) && !explicitlyExcludedTests.has(testName)
)

const staleExclusions = [...explicitlyExcludedTests.keys()].filter(
  (testName) => !allDetoxTests.includes(testName)
)

if (duplicateAssignments.length > 0) {
  console.error('Duplicate iOS Detox shard assignments:')
  for (const entry of duplicateAssignments) {
    console.error(`- ${entry}`)
  }
}

if (staleAssignments.length > 0) {
  console.error('Stale iOS Detox shard assignments:')
  for (const testName of staleAssignments) {
    console.error(`- ${testName}`)
  }
}

if (staleExclusions.length > 0) {
  console.error('Stale explicit shard exclusions:')
  for (const testName of staleExclusions) {
    console.error(`- ${testName}`)
  }
}

if (explicitlyExcludedTests.size > 0) {
  console.info('Explicitly excluded iOS Detox tests:')
  for (const [testName, reason] of explicitlyExcludedTests.entries()) {
    console.info(`- ${testName}: ${reason}`)
  }
}

if (
  duplicateAssignments.length > 0 ||
  staleAssignments.length > 0 ||
  staleExclusions.length > 0
) {
  process.exit(1)
}

const plannedShards = [...seedShards]
if (missingAssignments.length > 0) {
  const test_files = missingAssignments.map((testName) => `e2e/${testName}`).join(' ')
  plannedShards.push({
    name: 'auto-discovered',
    slug: 'auto-discovered',
    test_files,
  })

  console.info('Auto-discovered new iOS Detox tests:')
  for (const testName of missingAssignments) {
    console.info(`- ${testName}`)
  }

  if (missingAssignments.length > 4) {
    console.info(
      `::warning::Auto-discovered iOS Detox shard has ${missingAssignments.length} files; consider re-seeding shards if this approaches the 45-minute native-ci cap.`
    )
  }
}

console.info(
  `iOS Detox shard plan is valid (${plannedShards.length} shard${
    plannedShards.length === 1 ? '' : 's'
  }).`
)

if (shouldWriteGitHubOutput) {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) {
    console.error('GITHUB_OUTPUT is not set')
    process.exit(1)
  }

  const fs = await import('node:fs')
  fs.appendFileSync(outputPath, `shards=${JSON.stringify(plannedShards)}\n`)
}

function splitTestFiles(testFiles) {
  return testFiles
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}
