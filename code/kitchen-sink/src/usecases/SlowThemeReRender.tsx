import React from "react";import { Stack, Theme } from '@tamagui/core';

import { Button, View } from 'react-native';

const newArray = Array.from(Array(10).keys());

export function SlowThemeReRender() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const [type, setType] = React.useState<'Stack' | 'View'>('Stack');
  return (
    <Theme name={theme}>
      <Button
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title={`Toggle Theme ${theme}`}>
      </Button>
      <Button
        onPress={() => setType(type === 'Stack' ? 'View' : 'Stack')}
        title={
        type === 'Stack' ? 'Using Stack from Tamagui' : 'Using View with inline styles'} />



      <View
        style={{
          rowGap: 4,
          flexDirection: 'row',
          columnGap: 4,
          flexWrap: 'wrap'
        }}>

        {type === 'Stack' ?
        newArray.map((item) =>
        <Stack key={item} backgroundColor="$color" height={50} width={50} />
        ) :
        newArray.map((item) =>
        <View
          key={item}
          style={{
            backgroundColor: theme === 'dark' ? 'red' : 'blue',
            height: 50,
            width: 50
          }} />

        )}
      </View>
    </Theme>);

}