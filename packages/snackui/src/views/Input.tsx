import React, { forwardRef, useRef } from 'react'
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native'

import { combineRefs } from '../helpers/combineRefs'
import { useTextStylePropsSplit } from '../hooks/useTextStylePropsSplit'
import { isWeb, useIsomorphicLayoutEffect } from '../platform'
import { InteractiveContainer } from './InteractiveContainer'

// TODO make this extractable / take flat style props

type AutocompleteType =
  | 'cc-csc'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-number'
  | 'email'
  | 'name'
  | 'password'
  | 'postal-code'
  | 'street-address'
  | 'tel'
  | 'username'
  | 'off'
  
export type InputProps = Omit<TextInputProps, 'style' | 'name'> &
  Omit<TextStyle, 'name'> & {
    name?: AutocompleteType
  }

export const Input = forwardRef((props: InputProps, ref) => {
  const { textProps, styleProps } = useTextStylePropsSplit(props)
  const textRef = useRef<HTMLInputElement>()

  if (isWeb) {
    useIsomorphicLayoutEffect(() => {
      if (props.name) {
        textRef.current?.setAttribute('name', props.name)
      }
    }, [props.name])
  }

  return (
    <InteractiveContainer {...styleProps}>
      <TextInput
        ref={combineRefs(textRef as any, ref as any)}
        {...textProps}
        style={[
          sheet.inputStyle,
          {
            fontSize: styleProps.fontSize ?? 16,
            lineHeight: styleProps.lineHeight,
            fontWeight: styleProps.fontWeight,
            textAlign: styleProps.textAlign,
            color: styleProps.color,
          },
        ]}
      />
    </InteractiveContainer>
  )
})

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
