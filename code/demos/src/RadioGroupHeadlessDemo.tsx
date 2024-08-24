import type {
  RadioGroupContextValue,
  RadioGroupItemContextValue,
} from '@tamagui/radio-headless'
import {
  useRadioGroup,
  useRadioGroupItem,
  useRadioGroupItemIndicator,
} from '@tamagui/radio-headless'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { isWeb, useTheme } from 'tamagui'

const RadioGroupContext = React.createContext<RadioGroupContextValue>({})
const RadioGroupItemContext = React.createContext<RadioGroupItemContextValue>({
  checked: false,
  disabled: false,
})

export function RadioGroupHeadlessDemo() {
  const { providerValue, frameAttrs, rovingFocusGroupAttrs } = useRadioGroup({
    orientation: 'vertical',
    name: 'form',
    defaultValue: '3',
  })
  return (
    <RadioGroupContext.Provider value={providerValue}>
      <RovingFocusGroup {...rovingFocusGroupAttrs}>
        <View style={styles.radioGroup} {...frameAttrs}>
          <RadioGroupItem value="2" id="2" label="First Value" />
          <RadioGroupItem value="3" id="3" label="Second Value" />
          <RadioGroupItem value="4" id="4" label="Third Value" />
        </View>
      </RovingFocusGroup>
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem(props: {
  value: string
  id: string
  label: string
}) {
  const theme = useTheme()
  const { value, id, label } = props
  const {
    providerValue,
    native,
    bubbleInput,
    rovingFocusGroupAttrs,
    frameAttrs,
    isFormControl,
    checked,
  } = useRadioGroupItem({
    radioGroupContext: RadioGroupContext,
    value,
    id,
  })

  return (
    <RadioGroupItemContext.Provider value={providerValue}>
      {isWeb && native ? (
        bubbleInput
      ) : (
        <View style={styles.radioGroupItemContainer}>
          <RovingFocusGroup.Item {...rovingFocusGroupAttrs}>
            <Pressable
              style={{
                ...styles.radioGroupItem,
                ...{ borderColor: theme.borderColor.get() },
                ...(checked
                  ? { borderWidth: 4 }
                  : { backgroundColor: theme.background.get() }),
              }}
              {...frameAttrs}
              onFocus={frameAttrs.onFocus as any}
            >
              <RadioGroupItemIndicator />
            </Pressable>
          </RovingFocusGroup.Item>
          <Text style={{ color: theme.color.get() }}>{label}</Text>
          {isFormControl && bubbleInput}
        </View>
      )}
    </RadioGroupItemContext.Provider>
  )
}

function RadioGroupItemIndicator() {
  const theme = useTheme()
  const params = useRadioGroupItemIndicator({
    radioGroupItemContext: RadioGroupItemContext,
    disabled: false,
  })
  if (params.checked) {
    return (
      <View
        style={{
          ...styles.radioGroupItemIndicator,
          backgroundColor: theme.color.get(),
        }}
        {...params}
      />
    )
  }
  return null
}

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'flex-start',
  },
  radioGroupItem: {
    borderWidth: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroupItemIndicator: {
    width: '35%',
    height: '35%',
  },
  radioGroupItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
})
