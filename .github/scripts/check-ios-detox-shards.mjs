import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const repoRoot = process.cwd()
const workflowPath = join(repoRoot, '.github/workflows/test-native.yml')
const e2eDir = join(repoRoot, 'code/kitchen-sink/e2e')

const explicitlyExcludedTests = new Map([
  [
    'NestedPressExclusive.test.ts',
    'Known excluded from iOS Detox CI shard matrix pending stabilization.',
  ],
  [
    'TabsOnInteraction.test.ts',
    'Known excluded from iOS Detox CI shard matrix pending stabilization.',
  ],
])

const workflow = readFileSync(workflowPath, 'utf8')
const shardMatches = [...workflow.matchAll(/test_files:\s*'([^']*)'/g)]

if (shardMatches.length === 0) {
  console.error(`No iOS Detox shard definitions found in ${workflowPath}`)
  process.exit(1)
}

const assignedTestFiles = shardMatches.flatMap((match) =>
  match[1]
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
)

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

const missingAssignments = allDetoxTests.filter(
  (testName) => !counts.has(testName) && !explicitlyExcludedTests.has(testName)
)

const staleExclusions = [...explicitlyExcludedTests.keys()].filter(
  (testName) => !allDetoxTests.includes(testName)
)

if (
  duplicateAssignments.length === 0 &&
  missingAssignments.length === 0 &&
  staleExclusions.length === 0
) {
  console.info('iOS Detox shard coverage is valid.')
  process.exit(0)
}

if (duplicateAssignments.length > 0) {
  console.error('Duplicate iOS Detox shard assignments:')
  for (const entry of duplicateAssignments) {
    console.error(`- ${entry}`)
  }
}

if (missingAssignments.length > 0) {
  console.error('Missing iOS Detox tests from shard matrix:')
  for (const testName of missingAssignments) {
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
  console.error('Explicitly excluded iOS Detox tests:')
  for (const [testName, reason] of explicitlyExcludedTests.entries()) {
    console.error(`- ${testName}: ${reason}`)
  }
}

process.exit(1)
