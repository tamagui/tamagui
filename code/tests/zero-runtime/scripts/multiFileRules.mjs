// The expectation the multi-file fixture carries, shared by all three
// integrations so one edit to the fixture cannot leave two of them asserting
// last week's list.
//
// Every rule the compiler classifies appears once in this one build. A module
// that already has a compiler-local violation never reaches reference erasure,
// so rules 2 and 7 need modules of their own; that is why there are five.
// Asserting the exact per-site list rather than a count is what makes this a
// per-rule receipt for Next and Metro instead of a claim that classification is
// shared code.
import path from 'node:path'

export const MULTI_FILE_SITES = [
  {
    module: 'alpha.tsx',
    rule: 1,
    code: 'local/unsafe-style-spread',
    message:
      'Zero-runtime rule 1: View cannot receive a prop spread because the compiler cannot prove it is style-free.',
  },
  {
    module: 'alpha.tsx',
    rule: 4,
    code: 'local/unsupported-target',
    message:
      '[tamagui zero-runtime] Rule 4: View uses theme, which creates a runtime component theme boundary.',
  },
  {
    module: 'beta.tsx',
    rule: 6,
    code: 'local/unsupported-target',
    message:
      'Zero-runtime rule 6: ZStack does not lower to one host element with className and is island-only.',
  },
  {
    module: 'beta.tsx',
    rule: 3,
    code: 'local/dynamic-style-value',
    message: 'Zero-runtime rule 3: value for fontFamily on Text cannot be lowered',
  },
  {
    module: 'delta.tsx',
    rule: 2,
    code: 'zero/live-tamagui-reference',
    component: 'View',
    message:
      'Zero-runtime rule 2: component expression isWide ? View : Text does not resolve to one literal lowerable host component.',
  },
  {
    module: 'delta.tsx',
    rule: 2,
    code: 'zero/live-tamagui-reference',
    component: 'Text',
    message:
      'Zero-runtime rule 2: component expression isWide ? View : Text does not resolve to one literal lowerable host component.',
  },
  {
    module: 'epsilon.tsx',
    rule: 7,
    code: 'zero/design-state-read',
    message: 'Zero-runtime rule 7: useTheme reads Tamagui design state in JavaScript.',
  },
  {
    module: 'gamma.tsx',
    rule: 5,
    code: 'local/unsupported-target',
    message:
      'Zero-runtime rule 5: animateOnly on View requires a component animation runtime.',
  },
]

/**
 * Throws unless the build reported exactly these sites, in this order. The
 * order is the compiler's own deterministic sort, so an integration that
 * reports the same set differently is still a finding.
 */
export function assertMultiFileRules(integration, violations) {
  const actual = violations.map((violation) => ({
    module: path.basename(violation.file),
    rule: violation.rule,
    code: violation.code,
    ...(violation.component ? { component: violation.component } : {}),
    message: violation.message,
  }))
  if (actual.length !== MULTI_FILE_SITES.length) {
    throw new Error(
      `${integration}: the multi-file fixture reported ${actual.length} violations, expected ${MULTI_FILE_SITES.length}:\n${JSON.stringify(actual, null, 2)}`
    )
  }
  actual.forEach((site, index) => {
    const expected = MULTI_FILE_SITES[index]
    if (
      site.module !== expected.module ||
      site.rule !== expected.rule ||
      site.code !== expected.code ||
      (expected.component && site.component !== expected.component) ||
      !site.message.includes(expected.message)
    ) {
      throw new Error(
        `${integration}: multi-file violation ${index} did not match.\nexpected ${JSON.stringify(expected)}\nactual   ${JSON.stringify(site)}`
      )
    }
  })
  const rules = [...new Set(actual.map((site) => site.rule))].sort((a, b) => a - b)
  // the point of the fixture: one build, every rule
  if (rules.join(',') !== '1,2,3,4,5,6,7') {
    throw new Error(
      `${integration}: the multi-file fixture covered rules ${rules.join(',')}`
    )
  }
}
