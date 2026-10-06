import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { PopperAnchor, PopperProviderSlow } from '@tamagui/popper'
import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('web') as any)

afterEach(cleanup)

describe('scoped Popper hover guard', () => {
  test.each([
    ['defaultPrevented', true],
    ['isCanceled', true],
    ['defaultPrevented', false],
    ['isCanceled', false],
  ] as const)(
    '%s keeps the accepted reference and skips repositioning (interaction props: %s)',
    (signal, hasInteractionProps) => {
      const accepted = document.createElement('div')
      const reference = { current: accepted }
      const setReference = vi.fn((node) => {
        reference.current = node
      })
      const update = vi.fn()
      const onHoverReference = vi.fn()
      const guard = vi.fn((event) => {
        if (signal === 'defaultPrevented') event.preventDefault()
        else event.isCanceled = true
      })
      const { getByTestId } = render(
        <TamaguiProvider config={config} defaultTheme="light">
          <PopperProviderSlow
            scope="grouped-menu"
            refs={{ setReference } as any}
            update={update}
            getReferenceProps={hasInteractionProps ? (props) => props : undefined}
            onHoverReference={onHoverReference}
          >
            <PopperAnchor
              scope="grouped-menu"
              data-testid="rejected-trigger"
              onPointerEnter={guard}
            />
          </PopperProviderSlow>
        </TamaguiProvider>
      )

      fireEvent.mouseEnter(getByTestId('rejected-trigger'))

      expect(guard).toHaveBeenCalledOnce()
      expect(reference.current).toBe(accepted)
      expect(setReference).not.toHaveBeenCalled()
      expect(update).not.toHaveBeenCalled()
      expect(onHoverReference).not.toHaveBeenCalled()
    }
  )

  test.each([true, false])(
    'accepted hover updates reference before position and hover callback (interaction props: %s)',
    (hasInteractionProps) => {
      const calls: string[] = []
      const setReference = vi.fn(() => calls.push('reference'))
      const { getByTestId } = render(
        <TamaguiProvider config={config} defaultTheme="light">
          <PopperProviderSlow
            scope="grouped-menu"
            refs={{ setReference } as any}
            update={() => {
              calls.push('update')
            }}
            getReferenceProps={
              hasInteractionProps
                ? (props) => ({
                    ...props,
                    onPointerEnter: () => {
                      calls.push('guard')
                    },
                  })
                : undefined
            }
            onHoverReference={() => {
              calls.push('hover')
            }}
          >
            <PopperAnchor scope="grouped-menu" data-testid="accepted-trigger" />
          </PopperProviderSlow>
        </TamaguiProvider>
      )

      const trigger = getByTestId('accepted-trigger')
      fireEvent.mouseEnter(trigger)

      expect(setReference).toHaveBeenCalledWith(trigger)
      expect(calls).toEqual(
        hasInteractionProps
          ? ['guard', 'reference', 'update', 'hover']
          : ['reference', 'update']
      )
    }
  )
})
