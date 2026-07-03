import '@testing-library/jest-dom'

import { Avatar } from '@tamagui/avatar'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

function AvatarTest(props: React.ComponentProps<typeof Avatar>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Avatar circular {...props}>
        <Avatar.Image src="https://example.com/a.png" aria-label="user avatar" />
      </Avatar>
    </TamaguiProvider>
  )
}

// regression: Avatar.Image used to size itself via getShapeSize(context.size),
// which resolves a NUMERIC size as a size-token index. in the default config
// tokens.size[16] === 224, so <Avatar size={16}> blew the image up to 224px
// inside its 16px frame and object-fit:cover showed a blurry mis-cropped
// corner. the image must instead fill its frame (100%/100%) for any size.
describe('Avatar.Image sizing', () => {
  it('fills the frame for a numeric size (not the size-token value)', () => {
    const { container } = render(<AvatarTest size={16} />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img).toHaveStyle({ width: '100%', height: '100%' })
  })

  it('fills the frame for a token size', () => {
    const { container } = render(<AvatarTest size="$4" />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img).toHaveStyle({ width: '100%', height: '100%' })
  })
})
