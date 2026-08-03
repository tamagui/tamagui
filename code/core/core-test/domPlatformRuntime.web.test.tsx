import { TamaguiProvider, createTamagui, html } from '@tamagui/core'
import { fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { expect, test, vi } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

test('the Strict DOM platform fixture renders and interacts on web', () => {
  const mainRef = createRef<HTMLElement>()
  const onClick = vi.fn()
  const { getByLabelText, getByRole } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <html.main
        aria-label="strict DOM fixture"
        backgroundColor="white"
        padding={8}
        ref={mainRef}
      >
        <html.h1>Heading</html.h1>
        <html.button color="red" fontWeight="bold" onPress={onClick}>
          Press
        </html.button>
        <html.input aria-label="Name" type="text" />
        <html.img alt="Square" height={20} src="square.png" width={20} />
      </html.main>
    </TamaguiProvider>
  )

  expect(mainRef.current?.tagName).toBe('MAIN')
  expect(getComputedStyle(mainRef.current!).paddingTop).toBe('8px')
  expect(getByRole('heading', { name: 'Heading' }).tagName).toBe('H1')
  const image = getByRole('img', { name: 'Square' })
  expect(image.tagName).toBe('IMG')
  expect(getComputedStyle(image).width).toBe('20px')
  expect(getByLabelText('Name').tagName).toBe('INPUT')

  const button = getByRole('button', { name: 'Press' })
  expect(button.className).not.toBe('')
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledOnce()
})
