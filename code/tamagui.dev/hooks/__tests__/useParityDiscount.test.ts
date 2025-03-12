import { renderHook, act } from '@testing-library/react'
import { useParityDiscount } from '../useParityDiscount'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useParityDiscount', () => {
  const mockBannerHTML = `
    <div class="parity-banner">
      <div class="parity-banner-inner">
        Looks like you are from <b>Japan</b>. If you need it, use code <b>"pdsiurjf20"</b> to get <b>20%</b> off your subscription at checkout.
      </div>
      <button type="button" class="parity-banner-close-btn" aria-label="Close">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path fill="currentColor" d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"></path>
        </svg>
      </button>
    </div>
  `

  beforeEach(() => {
    // Clear the body before each test
    document.body.innerHTML = ''
  })

  it('should extract parity deals data when banner appears', async () => {
    const { result } = renderHook(() => useParityDiscount())

    // Initially, parityDeals should be null
    expect(result.current.parityDeals).toBeNull()

    // Simulate banner injection
    act(() => {
      document.body.innerHTML = mockBannerHTML
    })

    // Wait for MutationObserver to fire
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Check if the data was extracted correctly
    expect(result.current.parityDeals).toEqual({
      country: 'Japan',
      couponCode: 'pdsiurjf20',
      discountPercentage: '20',
    })

    // Check if the banner was removed
    expect(document.querySelector('.parity-banner')).toBeNull()
  })

  it('should handle malformed banner content', () => {
    const { result } = renderHook(() => useParityDiscount())

    // Inject malformed banner
    act(() => {
      document.body.innerHTML = `
        <div class="parity-banner">
          <div class="parity-banner-inner">
            Invalid content
          </div>
        </div>
      `
    })

    // parityDeals should remain null for invalid content
    expect(result.current.parityDeals).toBeNull()
  })

  it('should cleanup observer on unmount', () => {
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect')
    const { unmount } = renderHook(() => useParityDiscount())

    unmount()

    expect(disconnectSpy).toHaveBeenCalled()
    disconnectSpy.mockRestore()
  })

  it('should ignore non-parity-banner elements', () => {
    const { result } = renderHook(() => useParityDiscount())

    act(() => {
      document.body.innerHTML = `
        <div class="some-other-banner">
          <div class="parity-banner-inner">
            Looks like you are from <b>Japan</b>. If you need it, use code <b>"pdsiurjf20"</b> to get <b>20%</b> off your subscription at checkout.
          </div>
        </div>
      `
    })

    expect(result.current.parityDeals).toBeNull()
  })
})
