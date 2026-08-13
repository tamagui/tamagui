import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Portal, setDefaultPortalContainer } from '@tamagui/portal'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

const CONTENT_TEST_ID = 'portal-content'

function PortalTest() {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Portal>
        <div data-testid={CONTENT_TEST_ID} />
      </Portal>
    </TamaguiProvider>
  )
}

// querySelector does not pierce shadow roots, so a match inside document.body
// proves the portal escaped the shadow boundary
const findInBody = () => document.body.querySelector(`[data-testid=${CONTENT_TEST_ID}]`)

afterEach(() => {
  setDefaultPortalContainer(null)
})

describe('Portal (web)', () => {
  it('renders into document.body by default', () => {
    render(<PortalTest />)
    expect(findInBody()).toBeTruthy()
  })

  it('renders into the container set via setDefaultPortalContainer', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const overlay = document.createElement('div')
    shadow.appendChild(overlay)

    setDefaultPortalContainer(overlay)

    const bodyChildrenBefore = document.body.childElementCount
    render(<PortalTest />)

    expect(overlay.querySelector(`[data-testid=${CONTENT_TEST_ID}]`)).toBeTruthy()
    expect(findInBody()).toBeNull()
    // no portal root was appended to document.body (only the RTL container)
    expect(document.body.childElementCount).toBe(bodyChildrenBefore + 1)

    host.remove()
  })

  it('accepts a getter and restores document.body when reset to null', () => {
    const overlay = document.createElement('div')
    document.body.appendChild(overlay)

    setDefaultPortalContainer(() => overlay)
    const first = render(<PortalTest />)
    expect(overlay.querySelector(`[data-testid=${CONTENT_TEST_ID}]`)).toBeTruthy()
    first.unmount()

    setDefaultPortalContainer(null)
    render(<PortalTest />)
    const content = findInBody()
    expect(content).toBeTruthy()
    expect(overlay.contains(content)).toBe(false)

    overlay.remove()
  })
})
