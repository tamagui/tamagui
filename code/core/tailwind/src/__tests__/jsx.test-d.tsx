import { useRef } from 'react'
import { describe, test } from 'vitest'

import { Text, View, styled } from '../index'
import type { TailwindViewElement } from '../types'

/**
 * The `styled.test-d.ts` cases check props by calling components as functions, which
 * skips JSX-specific checking and never exercises `ref`. These are the same contract
 * written the way applications write it.
 */
describe('tailwind components in JSX', () => {
  test('className, children, behavior props and refs type', () => {
    const ref = useRef<TailwindViewElement>(null)

    return (
      <View ref={ref} className="p-4 grid-cols-3" id="account" onPress={() => {}}>
        <Text className="text-lg" aria-label="greeting">
          hi
        </Text>
      </View>
    )
  })

  test('tamagui inline style props are rejected in JSX', () => {
    return (
      <View
        // @ts-expect-error padding belongs to @tamagui/core authoring
        padding={4}
      />
    )
  })

  test('media and pseudo style objects are rejected in JSX', () => {
    return (
      <>
        <View
          // @ts-expect-error pseudo style objects belong to @tamagui/core authoring
          hoverStyle={{ backgroundColor: 'red' }}
        />
        <View
          // @ts-expect-error media style objects belong to @tamagui/core authoring
          $sm={{ padding: 4 }}
        />
      </>
    )
  })

  test('a class-first styled component keeps finite variant props in JSX', () => {
    const Frame = styled(View, 'p-4', {
      variants: {
        tone: { warn: 'bg-yellow-500', danger: 'bg-red-500' },
      },
    })

    return (
      <>
        <Frame tone="danger" className="rounded-lg" />
        {/* @ts-expect-error 'quiet' is not one of the declared tone matchers */}
        <Frame tone="quiet" />
      </>
    )
  })
})
