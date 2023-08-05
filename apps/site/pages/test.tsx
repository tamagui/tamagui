// import '../lib/wdyr'

// debug
import { memo, useState } from 'react'
import { Platform } from 'react-native'
import {
  Switch as TSwitch,
  Input as TamaguiInput,
  createStyledContext,
  styled,
  useThemeName,
} from 'tamagui'

import { ThemeToggle } from '../components/ThemeToggle'

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
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        <ThemeToggle />
      </div>
      <Switch />
    </div>
  )
})

const context = createStyledContext({
  checked: false,
})

const padding = 2

const thumbSize = 20

const width = thumbSize * 2 + padding * 2
const height = thumbSize + padding * 2

const Thumb = styled(TSwitch.Thumb, {
  unstyled: true,
  bg: '$color12',
  height: thumbSize,
  width: thumbSize,
  br: '$4',
  animation: '100ms',
  // animateOnly: ['transform'],
  variants: {
    checked: {
      true: {
        bg: '$color2',
        x: width - thumbSize - padding,
      },
      false: {
        bg: '$color11',
        x: padding,
      },
    },
  } as const,
})

const Frame = styled(TSwitch, {
  unstyled: true,
  borderRadius: '$4',
  borderWidth: 0,
  padding: 0,
  ai: 'center',
  width: width,
  cur: 'pointer',
  height,
  minHeight: 0,
  variants: {
    checked: {
      true: {
        bg: 'green',
      },
      false: {
        bg: 'red',
      },
    },
  } as const,
})

export const Switch = ({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
}) => {
  const [x, setX] = useState(true)
  return (
    <Frame checked={x} id={id} onCheckedChange={setX} height={height}>
      <Thumb checked={checked} />
    </Frame>
  )
}

// text input test font family

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
