process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createRefComponent, createTamagui } from '@tamagui/core'
import { Dialog } from '@tamagui/dialog'
import { cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import type { Ref } from 'react'
import { expect, test, vi } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('web'))

test('createRefComponent passes the ref prop to the render function', () => {
  const ref = () => {}
  let forwardedRef: Ref<HTMLDivElement> | undefined
  let renderedProps: { label: string } | undefined

  function NamedComponent(
    props: { label: string },
    ref: Ref<HTMLDivElement> | undefined
  ) {
    forwardedRef = ref
    renderedProps = props
    return props.label
  }

  const Component = createRefComponent<HTMLDivElement, { label: string }>(NamedComponent)
  const output = Component({ label: 'Submit', ref })

  expect(output).toBe('Submit')
  expect(forwardedRef).toBe(ref)
  expect(renderedProps).toEqual({ label: 'Submit' })
  expect(Component.displayName).toBe('NamedComponent')
})

test('Dialog.Portal composes a consumer ref with its internal dialog ref', async () => {
  const dialogPrototype = HTMLDialogElement.prototype as HTMLDialogElement & {
    show?: () => void
    close?: () => void
  }
  const originalShow = dialogPrototype.show
  const originalClose = dialogPrototype.close
  const show = vi.fn()

  dialogPrototype.show = show
  dialogPrototype.close = vi.fn()

  try {
    const consumerRef = React.createRef<HTMLDialogElement>()

    render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Dialog open>
          <Dialog.Portal ref={consumerRef} />
        </Dialog>
      </TamaguiProvider>
    )

    await waitFor(() => {
      expect(consumerRef.current).toBeInstanceOf(HTMLDialogElement)
    })
    await waitFor(() => {
      expect(show).toHaveBeenCalled()
    })
  } finally {
    cleanup()
    if (originalShow) {
      dialogPrototype.show = originalShow
    } else {
      delete dialogPrototype.show
    }
    if (originalClose) {
      dialogPrototype.close = originalClose
    } else {
      delete dialogPrototype.close
    }
  }
})
