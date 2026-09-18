import { beforeEach, describe, expect, it } from 'vitest'
import {
  isRateLimitedOrDuplicate,
  resetErrorLimitsForTesting,
  shouldIgnoreError,
} from './errorHandling'

describe('errorHandling filtering and limiting', () => {
  beforeEach(() => {
    resetErrorLimitsForTesting()
  })

  describe('shouldIgnoreError', () => {
    it('ignores extension errors', () => {
      const extError = new Error('something failed')
      extError.stack =
        'Error: something\n  at chrome-extension://abcdefghijklmnop/content.js:10:5'
      expect(shouldIgnoreError(extError)).toBe(true)

      const mozError = new Error('moz failure')
      mozError.stack = 'Error: moz\n  at moz-extension://1234-5678/script.js:1:1'
      expect(shouldIgnoreError(mozError)).toBe(true)

      const urlError = new Error('failed')
      expect(shouldIgnoreError(urlError, 'chrome-extension://xyz/app.js')).toBe(true)
    })

    it('ignores benign browser errors', () => {
      expect(
        shouldIgnoreError(
          new Error('ResizeObserver loop completed with undelivered notifications.')
        )
      ).toBe(true)
      expect(shouldIgnoreError(new Error('ResizeObserver loop limit exceeded'))).toBe(
        true
      )
      expect(shouldIgnoreError(new Error('Script error.'))).toBe(true)
    })

    it('ignores aborted requests', () => {
      const abortError = new Error('The user aborted a request.')
      abortError.name = 'AbortError'
      expect(shouldIgnoreError(abortError)).toBe(true)

      expect(shouldIgnoreError(new Error('The operation was aborted.'))).toBe(true)
      expect(shouldIgnoreError(new Error('signal is aborted without reason'))).toBe(true)
    })

    it('ignores network drops and adblocker drops', () => {
      expect(shouldIgnoreError(new Error('net::ERR_BLOCKED_BY_CLIENT'))).toBe(true)
      expect(shouldIgnoreError(new Error('Failed to fetch'))).toBe(true)
      expect(
        shouldIgnoreError(new Error('NetworkError when attempting to fetch resource.'))
      ).toBe(true)
      expect(shouldIgnoreError(new Error('Load failed'))).toBe(true)
    })

    it('ignores router loader 404s', () => {
      expect(
        shouldIgnoreError(
          new Error('[one] 404 loader for /ui/button.md: ssg route not in routeMap')
        )
      ).toBe(true)
    })

    it('does not ignore real errors', () => {
      expect(shouldIgnoreError(new Error('Cannot read property of undefined'))).toBe(
        false
      )
      expect(shouldIgnoreError(new TypeError('x.map is not a function'))).toBe(false)
    })
  })

  describe('deduplication and rate limiting', () => {
    it('deduplicates identical errors', () => {
      const error = new Error('ReferenceError: foo is not defined')
      error.name = 'ReferenceError'

      expect(isRateLimitedOrDuplicate(error)).toBe(false)
      // Second time should be detected as duplicate
      expect(isRateLimitedOrDuplicate(error)).toBe(true)
      // Third time also duplicate
      expect(isRateLimitedOrDuplicate(error)).toBe(true)
    })

    it('allows different errors up to limit', () => {
      for (let i = 0; i < 10; i++) {
        const error = new Error(`Unique error ${i}`)
        expect(isRateLimitedOrDuplicate(error)).toBe(false)
      }

      // 11th error in the same minute should be rate limited
      const error11 = new Error('11th unique error')
      expect(isRateLimitedOrDuplicate(error11)).toBe(true)
    })
  })
})
