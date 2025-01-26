import React from 'react'
import type { ThemeName } from 'tamagui'
import type { AnimationProp } from '@tamagui/web'
import { Button, Theme, View, styled } from 'tamagui'

type variants = {
  theme: ThemeName[]
  variant: 'bouncy' | 'lazy' | 'pulse' | 'inverse' | 'bump'
  animation: AnimationProp
}
const themes: ThemeName[] = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green']

const variants: variants[] = [
  {
    theme: themes,
    variant: 'pulse',
    animation: '100ms',
  },
  {
    theme: themes,
    variant: 'inverse',
    animation: '100ms',
  },
  {
    theme: themes,
    variant: 'bouncy',
    animation: 'bouncy',
  },
  {
    theme: themes,
    variant: 'lazy',
    animation: 'medium',
  },
  {
    theme: themes,
    variant: 'bump',
    animation: 'bouncy',
  },
]

/** ------ EXAMPLE ------ */
export function ButtonPulse() {
  return (
    <View
      flexDirection="row"
      gap="$4"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      maxWidth={850}
      $group-window-sm={{ padding: '$6' }}
    >
      {variants.map((v) => (
        <React.Fragment key={v.variant}>
          {[...v.theme]
            .sort(() => Math.random() - 0.5)
            .map((theme) => (
              <Theme key={theme} name={theme}>
                <CustomButton
                  animVariant={v.variant}
                  themeInverse={v.variant === 'inverse'}
                  animation={v.animation}
                >
                  <Button.Text>Press me</Button.Text>
                </CustomButton>
              </Theme>
            ))}
        </React.Fragment>
      ))}
    </View>
  )
}

const CustomButton = styled(Button, {
  variants: {
    animVariant: {
      pulse: {
        elevation: 15,
        pressStyle: {
          elevation: 2,
          scale: 0.95,
        },
      },
      inverse: {
        elevation: 15,
        pressStyle: {
          elevation: 2,
          scale: 0.95,
        },
      },
      bouncy: {
        theme: 'alt1',
        elevation: 15,
        pressStyle: {
          elevation: 7,
          scale: 0.9,
        },
      },
      lazy: {
        theme: 'active',
        elevation: 15,
        pressStyle: {
          elevation: 7,
          scale: 0.9,
        },
      },
      bump: {
        theme: 'surface1',
        elevation: 15,
        pressStyle: {
          elevation: 7,
          scale: 1.2,
        },
      },
    },
  } as const,
})

ButtonPulse.fileName = 'ButtonPulse'
