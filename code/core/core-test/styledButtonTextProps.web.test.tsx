process.env.TAMAGUI_TARGET = 'web'

// a styled() layer over the Button skin resolves style props itself, so text
// styles like color never reached the skin's label: the label kept the theme
// color while a plain Button got the authored one.
import { render } from '@testing-library/react'
import React from 'react'
import { expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui, styled } from '@tamagui/core'
import { Button } from '../../ui/tamagui/src/components/Button'

const config = createTamagui(getDefaultTamaguiConfig('web'))

const Restyled = styled(Button, { borderRadius: 4 })

function labelColor(element: React.ReactElement) {
  const { getByText } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      {element}
    </TamaguiProvider>
  )
  return getByText('label').className
}

test('a restyled Button gives its label the authored text styles', () => {
  const plain = labelColor(<Button color="red">label</Button>)
  document.body.innerHTML = ''
  const restyled = labelColor(<Restyled color="red">label</Restyled>)
  const colorClass = (className: string) => className.split(' ').find((c) => c.startsWith('_c-'))
  expect(colorClass(plain)).toBeTruthy()
  expect(colorClass(restyled)).toBe(colorClass(plain))
})
