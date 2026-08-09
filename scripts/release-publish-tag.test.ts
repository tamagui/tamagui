import { describe, expect, test } from 'bun:test'

import { computePublishTag } from './release-publish-tag'

describe('computePublishTag', () => {
  test('stable X.Y.Z -> latest', () => {
    expect(computePublishTag('2.4.0')).toBe('latest')
    expect(computePublishTag('3.0.0')).toBe('latest')
  })

  test('beta prerelease -> beta', () => {
    expect(computePublishTag('3.0.0-beta.0')).toBe('beta')
    expect(computePublishTag('3.0.0-beta.12')).toBe('beta')
  })

  test('rc prerelease -> rc (never latest)', () => {
    expect(computePublishTag('2.0.0-rc.34')).toBe('rc')
  })

  test('alpha / next / nightly channels', () => {
    expect(computePublishTag('3.0.0-alpha.1')).toBe('alpha')
    expect(computePublishTag('3.0.0-next.1')).toBe('next')
    expect(computePublishTag('3.0.0-nightly.1')).toBe('nightly')
  })

  test('canary timestamp version -> canary', () => {
    expect(computePublishTag('3.0.0-1751023456789')).toBe('canary')
  })

  test('--canary flag -> canary', () => {
    expect(computePublishTag('3.0.0', { canary: true })).toBe('canary')
  })

  test('explicit --tag always wins', () => {
    // even a stable version can be forced onto an arbitrary tag
    expect(computePublishTag('2.4.0', { explicitTag: 'beta' })).toBe('beta')
    // and a prerelease can be explicitly forced onto latest (the escape hatch)
    expect(computePublishTag('3.0.0-beta.0', { explicitTag: 'latest' })).toBe('latest')
  })

  test('unrecognized prerelease WITHOUT --tag fails loudly (never latest)', () => {
    expect(() => computePublishTag('3.0.0-experimental.1')).toThrow(
      /Refusing to publish prerelease/
    )
    expect(() => computePublishTag('3.0.0-foo')).toThrow(/no known dist-tag/)
  })

  test('unrecognized prerelease WITH explicit --tag succeeds', () => {
    expect(
      computePublishTag('3.0.0-experimental.1', { explicitTag: 'experimental' })
    ).toBe('experimental')
  })
})
