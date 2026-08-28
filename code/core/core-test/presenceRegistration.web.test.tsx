process.env.TAMAGUI_TARGET = 'web'

import { PresenceContext, usePresence } from '@tamagui/use-presence'
import type { PresenceContextProps } from '@tamagui/web'
import { render } from '@testing-library/react'
import { memo, useRef } from 'react'
import { describe, expect, test, vi } from 'vitest'

const AnimatedChild = memo(() => {
  const registration = useRef({ shouldRegisterPresence: true })
  usePresence(registration.current)
  return null
})

function PlainChild() {
  const registration = useRef({ shouldRegisterPresence: false })
  usePresence(registration.current)
  return null
}

function LateAnimatedChild({ animated }: { animated: boolean }) {
  const registration = useRef({ shouldRegisterPresence: animated })
  registration.current.shouldRegisterPresence = animated
  usePresence(registration.current)
  return null
}

describe('presence registration', () => {
  test('removing a plain sibling preserves the animated registration', () => {
    let registered = false
    const register = vi.fn(() => {
      registered = true
      return () => {
        registered = false
      }
    })
    const context: PresenceContextProps = {
      id: 'frame',
      isPresent: true,
      register,
    }

    const rendered = render(
      <PresenceContext.Provider value={context}>
        <AnimatedChild />
        <PlainChild />
      </PresenceContext.Provider>
    )

    expect(register).toHaveBeenCalledTimes(1)
    expect(registered).toBe(true)

    rendered.rerender(
      <PresenceContext.Provider value={context}>
        <AnimatedChild />
      </PresenceContext.Provider>
    )

    expect(register).toHaveBeenCalledTimes(1)
    expect(registered).toBe(true)
  })

  test('a registration that widens after mount registers on the next render', () => {
    const register = vi.fn(() => vi.fn())
    const context: PresenceContextProps = {
      id: 'frame',
      isPresent: true,
      register,
    }
    const rendered = render(
      <PresenceContext.Provider value={context}>
        <LateAnimatedChild animated={false} />
      </PresenceContext.Provider>
    )

    expect(register).not.toHaveBeenCalled()
    rendered.rerender(
      <PresenceContext.Provider value={context}>
        <LateAnimatedChild animated />
      </PresenceContext.Provider>
    )
    expect(register).toHaveBeenCalledTimes(1)
  })
})
