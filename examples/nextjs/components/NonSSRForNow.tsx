// debug
import React from 'react'
import { HStack, Text, Theme, useTheme } from 'snackui'

function Examples() {
  return (
    <>
      <Example />
      <Theme name="dark">
        <Example>
          <Theme name="light">
            <Example alternate />
          </Theme>
        </Example>
      </Theme>
    </>
  )
}

function Example(props: { alternate?: boolean; children?: any }) {
  const theme = useTheme()
  return (
    <HStack
      alignItems="center"
      padding={10}
      flex={1}
      backgroundColor={theme.backgroundColor}
    >
      <Text color={theme.color}>Hello&nbsp;</Text>
      <Text color={props.alternate ? theme.altColor : theme.color}>
        from SnackUI
      </Text>
      {props.children}
    </HStack>
  )
}

export default Examples
