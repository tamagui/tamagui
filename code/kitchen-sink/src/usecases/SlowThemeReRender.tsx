import React from 'react'
import { View as TamaguiView, Theme } from '@tamagui/core'

import { Button, View as RNView } from 'react-native'

const newArray = Array.from(Array(10).keys())

export function SlowThemeReRender() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const [type, setType] = React.useState<'Tamagui' | 'RN'>('Tamagui')
  return (
    <Theme name={theme}>
      <Button
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title={`Toggle Theme ${theme}`}
      ></Button>
      <Button
        onPress={() => setType(type === 'Tamagui' ? 'RN' : 'Tamagui')}
        title={
          type === 'Tamagui' ? 'Using View from Tamagui' : 'Using View with inline styles'
        }
      />

      <RNView
        style={{
          rowGap: 4,
          flexDirection: 'row',
          columnGap: 4,
          flexWrap: 'wrap',
        }}
      >
        {type === 'Tamagui'
          ? newArray.map((item) => (
              <TamaguiView key={item} backgroundColor="$color" height={50} width={50} />
            ))
          : newArray.map((item) => (
              <RNView
                key={item}
                style={{
                  backgroundColor: theme === 'dark' ? 'red' : 'blue',
                  height: 50,
                  width: 50,
                }}
              />
            ))}
      </RNView>
    </Theme>
  )
}
