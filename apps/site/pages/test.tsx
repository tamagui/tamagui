import '../lib/wdyr'

import { AnimationsDemo } from '@tamagui/demos'
// debug
import { memo } from 'react'
import { Platform } from 'react-native'
import { Input as TamaguiInput, styled, useThemeName } from 'tamagui'

export default memo(() => {
  console.warn('rendereingasd')
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1,
      }}
    >
      <AnimationsDemo />
    </div>
  )
})

type RequireField<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

const TextInput = styled(
  TamaguiInput,
  {
    fontSize: 16,
    fontFamily: '$silkscreen',
    color: '$color5',
    minWidth: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    variants: {
      unset: {
        false: {
          borderWidth: 2,
          py: '$2',
          px: '$3',
          borderRadius: 6,
          bg: '$color3',
          focusStyle: {
            bg: '$color4',
            margin: 0,
          },
        },
      },
    } as const,
    defaultVariants: {
      unset: false,
    },
  },
  {
    inlineProps: new Set(['id', 'testID']),
  }
)

export const Input = TamaguiInput.styleable<
  RequireField<React.ComponentProps<typeof TextInput>, 'accessibilityLabel'>
>(function MyInput({ ...props }, ref) {
  const parentTheme = useThemeName()

  return (
    <TextInput
      unstyled
      keyboardAppearance={parentTheme?.includes('dark') ? 'dark' : 'default'}
      testID={props.testID ?? props.id}
      {...props}
      focusStyle={{ margin: 0, ...props.focusStyle }}
      id={Platform.select({
        // on native, this leads to duplicates?
        web: props.id,
      })}
      ref={ref}
    />
  )
})
