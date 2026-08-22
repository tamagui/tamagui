import '@testing-library/jest-dom'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { toast, Toaster } from '@tamagui/toast/v2'
import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

afterEach(() => {
  toast.dismiss()
  vi.restoreAllMocks()
})

function renderToaster() {
  return render(
    <TamaguiProvider config={conf} defaultTheme="light">
      <PortalProvider shouldAddRootHost>
        <Toaster duration={Number.POSITIVE_INFINITY} />
      </PortalProvider>
    </TamaguiProvider>
  )
}

describe('Toast v2 web accessibility props', () => {
  test('does not forward accessibilityLabel to the DOM', async () => {
    // react warns on the presence of the camelCased key, value or not
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { container } = renderToaster()
    await act(async () => {
      toast('hello')
    })

    expect(container.querySelector('[accessibilitylabel]')).toBeNull()
    const warned = errorSpy.mock.calls.some((args) =>
      args.some((arg) => typeof arg === 'string' && arg.includes('accessibilityLabel'))
    )
    expect(warned).toBe(false)
  })
})
