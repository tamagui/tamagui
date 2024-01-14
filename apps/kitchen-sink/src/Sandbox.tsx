// debug-verbose
// import './wdyr'

import { memo, useState } from 'react'
import { View } from 'react-native'
import { Square, SquareProps, XStack, XStackProps } from 'tamagui'

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <ThemeTestSquare theme="yellow">
          <ThemeTestSquare theme="green">
            <ThemeTestSquare theme="alt1">
              <ThemeTestSquare bc="$color10" />
              <ThemeTestSquare animation="bouncy" bc="$color10" />
            </ThemeTestSquare>
          </ThemeTestSquare>
        </ThemeTestSquare>
      </>
    </View>
  )
}

const ThemeTestSquare = memo(({ children, ...props }: XStackProps) => {
  const [theme, setTheme] = useState(props.theme)

  return (
    <XStack
      width="80%"
      height="50%"
      bc="$color5"
      {...props}
      theme={theme}
      onPress={(e) => {
        setTheme(theme === 'red' ? props.theme : 'red')
        e.stopPropagation()
      }}
    >
      {children}
    </XStack>
  )
})
