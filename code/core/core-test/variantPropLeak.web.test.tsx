process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import * as React from 'react'

import { View, TamaguiProvider, createTamagui, styled } from '../web/src'

const conf = createTamagui(getDefaultTamaguiConfig())

const W = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={conf} defaultTheme="light">
    {children}
  </TamaguiProvider>
)

// regression: a prop declared as a variant ANYWHERE in the inheritance chain
// must not leak to the host element even when the leaf component doesn't
// actively consume it. covers the soot tooltip pattern (TooltipContent unstyled)
// where intermediaries pass the prop through `.styleable` chains.
describe('variant prop does not leak to host element', () => {
  test(`<C unstyled /> with variant declared on C`, () => {
    const C = styled(View, {
      variants: { unstyled: { true: {} } } as const,
    })
    const { container } = render(
      <W>
        <C unstyled data-testid="c" />
      </W>
    )
    expect(container.querySelector('[data-testid="c"]')!.hasAttribute('unstyled')).toBe(
      false
    )
  })

  test(`<Outer unstyled /> with variant inherited via styled chain`, () => {
    const Inner = styled(View, {
      variants: { unstyled: { true: {} } } as const,
    })
    const Outer = styled(Inner, {})
    const { container } = render(
      <W>
        <Outer unstyled data-testid="o" />
      </W>
    )
    expect(container.querySelector('[data-testid="o"]')!.hasAttribute('unstyled')).toBe(
      false
    )
  })

  test(`<C unstyled={false} /> with variant only declaring 'true' (resolveVariants returns undefined)`, () => {
    const C = styled(View, {
      variants: { unstyled: { true: {} } } as const,
    })
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(
      <W>
        <C unstyled={false} data-testid="c" />
      </W>
    )
    expect(container.querySelector('[data-testid="c"]')!.hasAttribute('unstyled')).toBe(
      false
    )
    const warn = errSpy.mock.calls.find(
      (a) =>
        typeof a[0] === 'string' && a[0].includes('Received') && a.includes('unstyled')
    )
    expect(warn).toBeUndefined()
    errSpy.mockRestore()
  })

  test(`.styleable HOC chain forwarding to leaf with variant (soot tooltip pattern)`, () => {
    const Frame = styled(View, {
      variants: { unstyled: { true: {} } } as const,
    })
    const PopoverContent = (Frame as any).styleable(
      function PopoverContent(props: any, ref: any) {
        return <Frame ref={ref} {...props} />
      }
    )
    const TooltipContent = (Frame as any).styleable(
      function TooltipContent(props: any, ref: any) {
        return <PopoverContent ref={ref} {...props} />
      }
    )
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(
      <W>
        <TooltipContent unstyled data-testid="t" />
      </W>
    )
    expect(container.querySelector('[data-testid="t"]')!.hasAttribute('unstyled')).toBe(
      false
    )
    const warn = errSpy.mock.calls.find(
      (a) =>
        typeof a[0] === 'string' && a[0].includes('Received') && a.includes('unstyled')
    )
    expect(warn).toBeUndefined()
    errSpy.mockRestore()
  })

  test(`userland variant prop (not unstyled) also doesn't leak`, () => {
    const C = styled(View, {
      variants: { myToggle: { true: {} } } as const,
    })
    const { container } = render(
      <W>
        {/* @ts-expect-error - testing custom variant prop */}
        <C myToggle data-testid="c" />
      </W>
    )
    expect(container.querySelector('[data-testid="c"]')!.hasAttribute('mytoggle')).toBe(
      false
    )
  })
})
