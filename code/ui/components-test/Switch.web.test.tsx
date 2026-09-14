import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Switch, SwitchStyledContext } from '@tamagui/switch'
import { DirectionProvider } from '@tamagui/use-direction'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

const FRAME_WIDTH = 40
const THUMB_TEST_ID = 'switch-thumb'

// the thumb reads the measured frame width off context, and jsdom reports no
// layout, so feed the width in directly to keep the travel distance non-zero
function ThumbTest({ dir, active }: { dir: 'ltr' | 'rtl'; active: boolean }) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <DirectionProvider dir={dir}>
        <SwitchStyledContext.Provider active={active} frameWidth={FRAME_WIDTH}>
          <Switch.Thumb unstyled data-testid={THUMB_TEST_ID} />
        </SwitchStyledContext.Provider>
      </DirectionProvider>
    </TamaguiProvider>
  )
}

// renders unchecked then checks it, so the thumb starts at its resting edge
// and we read the travel it makes towards the other edge
function getCheckedTravel(dir: 'ltr' | 'rtl') {
  const rendered = render(<ThumbTest dir={dir} active={false} />)
  rendered.rerender(<ThumbTest dir={dir} active />)
  const thumb = rendered.getByTestId(THUMB_TEST_ID)
  const translate = /translateX\((-?[\d.]+)px\)/.exec(getComputedStyle(thumb).transform)
  rendered.unmount()
  return translate ? Number(translate[1]) : Number.NaN
}

describe('Switch.Thumb travel', () => {
  it('should move the thumb towards the trailing edge in ltr', () => {
    expect(getCheckedTravel('ltr')).toBeGreaterThan(0)
  })

  it('should mirror the thumb travel in rtl', () => {
    expect(getCheckedTravel('rtl')).toBe(-getCheckedTravel('ltr'))
  })
})
