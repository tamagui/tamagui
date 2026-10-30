process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createRefComponent, createTamagui } from '@tamagui/core'
import { Dialog } from '@tamagui/dialog'
import { cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import type { Ref } from 'react'
import { expect, test } from 'vitest'

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

test('Dialog.Portal forwards the consumer ref to its frame', async () => {
  const consumerRef = React.createRef<HTMLDivElement>()

  render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Dialog open>
        <Dialog.Portal ref={consumerRef} />
      </Dialog>
    </TamaguiProvider>
  )

  await waitFor(() => {
    expect(consumerRef.current).toBeInstanceOf(HTMLDivElement)
  })
  cleanup()
})
