import { createRefComponent } from '@tamagui/core'
import type { Ref } from 'react'
import { expect, test } from 'vitest'

test('createRefComponent passes the ref prop to the render function', () => {
  const ref = () => {}
  let forwardedRef: Ref<HTMLDivElement> | undefined

  function NamedComponent(
    props: { label: string },
    ref: Ref<HTMLDivElement> | undefined
  ) {
    forwardedRef = ref
    return props.label
  }

  const Component = createRefComponent<HTMLDivElement, { label: string }>(NamedComponent)
  const output = Component({ label: 'Submit', ref })

  expect(output).toBe('Submit')
  expect(forwardedRef).toBe(ref)
  expect(Component.displayName).toBe('NamedComponent')
})
