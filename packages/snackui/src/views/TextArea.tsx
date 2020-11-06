import React from 'react'
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native'

import { useTextStylePropsSplit } from '../hooks/useTextStylePropsSplit'
import { InteractiveContainer } from './InteractiveContainer'

export const TextArea = (
  props: Omit<TextInputProps, 'style'> &
    TextStyle & {
      name?: string
    }
) => {
  const { textProps, styleProps } = useTextStylePropsSplit(props)
  return (
    <InteractiveContainer {...styleProps}>
      <TextInput
        multiline
        numberOfLines={4}
        {...textProps}
        style={[
          sheet.inputStyle,
          {
            fontSize: styleProps.fontSize,
            lineHeight: styleProps.lineHeight,
            fontWeight: styleProps.fontWeight,
            textAlign: styleProps.textAlign,
          },
        ]}
      />
    </InteractiveContainer>
  )
}

const sheet = StyleSheet.create({
  inputStyle: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: 'rgb(100, 100, 100)',
  },
})
