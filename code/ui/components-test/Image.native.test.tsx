import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { createImage } from '@tamagui/image'
import { TamaguiProvider, createTamagui, setMediaState } from '@tamagui/core'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig('native'))
const HostImage = React.forwardRef<any, any>((props, ref) =>
  React.createElement('image-host', { ...props, ref })
)
const Image = createImage({ Component: HostImage })

afterEach(() => {
  setMediaState({})
})

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }

  return style || {}
}

test('Image resolves Tamagui styles and preserves native image props', async () => {
  const source = { uri: 'https://example.com/image.png' }
  const onLoad = vi.fn()
  let rendered: TestRenderer.ReactTestRenderer
  setMediaState({ sm: true } as any)

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Image
          source={source}
          objectFit="contain"
          position="absolute"
          t={1}
          l={2}
          r={3}
          b={4}
          bg="$background"
          br="$4"
          aspectRatio={2}
          $sm={{ opacity: 0.5 }}
          accessibilityLabel="test image"
          onLoad={onLoad}
        />
      </TamaguiProvider>
    )
  })

  const hostImage = rendered!.root.findByType('image-host')
  const style = flattenStyle(hostImage.props.style)

  expect(style).toMatchObject({
    position: 'absolute',
    top: 1,
    left: 2,
    right: 3,
    bottom: 4,
    aspectRatio: 2,
    opacity: 0.5,
  })
  expect(style.backgroundColor).toBeTruthy()
  expect(style.borderTopLeftRadius).toBeTypeOf('number')
  expect(style.borderTopRightRadius).toBe(style.borderTopLeftRadius)
  expect(style.borderBottomLeftRadius).toBe(style.borderTopLeftRadius)
  expect(style.borderBottomRightRadius).toBe(style.borderTopLeftRadius)
  expect(hostImage.props.source).toEqual(source)
  expect(hostImage.props.resizeMode).toBe('contain')
  expect(hostImage.props.accessibilityLabel).toBe('test image')

  await act(async () => {
    hostImage.props.onLoad({
      nativeEvent: {
        source: {
          width: 100,
          height: 50,
        },
      },
    })
  })

  expect(onLoad).toHaveBeenCalledWith({
    target: {
      naturalHeight: 50,
      naturalWidth: 100,
    },
    type: 'load',
  })

  await act(async () => {
    rendered!.unmount()
  })
})

test('Image prefers src when both source props are provided', async () => {
  let rendered: TestRenderer.ReactTestRenderer

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Image
          src="https://example.com/preferred.png"
          source={{ uri: 'https://example.com/deprecated.png' }}
        />
      </TamaguiProvider>
    )
  })

  expect(rendered!.root.findByType('image-host').props.source).toMatchObject({
    uri: 'https://example.com/preferred.png',
  })

  await act(async () => {
    rendered!.unmount()
  })
})

test('Image keeps layout dimensions out of native source metadata', async () => {
  let rendered: TestRenderer.ReactTestRenderer

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        <>
          <Image
            testID="numeric"
            src="https://example.com/numeric.png"
            width={120}
            height={80}
          />
          <Image
            testID="percentage"
            src="https://example.com/percentage.png"
            width="100%"
            height="50%"
          />
        </>
      </TamaguiProvider>
    )
  })

  const [numericImage, percentageImage] = rendered!.root.findAllByType('image-host')
  expect(flattenStyle(numericImage.props.style)).toMatchObject({
    width: 120,
    height: 80,
  })
  expect(numericImage.props.source).toEqual({
    uri: 'https://example.com/numeric.png',
  })

  expect(flattenStyle(percentageImage.props.style)).toMatchObject({
    width: '100%',
    height: '50%',
  })
  expect(percentageImage.props.source).toEqual({
    uri: 'https://example.com/percentage.png',
  })

  await act(async () => {
    rendered!.unmount()
  })
})
