import {
  RadioGroupContextValue,
  RadioGroupItemContextValue,
  useRadioGroup,
  useRadioGroupItem,
  useRadioGroupItemIndicator,
} from '@tamagui/radio-headless'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { createContext } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import { useTheme } from 'tamagui'
const RadioGroupContext = createContext<RadioGroupContextValue>({})
const RadioGroupItemContext = createContext<RadioGroupItemContextValue>({
  checked: false,
  disabled: false,
})

export function RadioGroupHeadlessDemo() {
  const { radioGroupProviderProps, frameProps, rovingProps } = useRadioGroup({
    orientation: 'horizontal',
    name: 'form',
    defaultValue: '3',
  })
  return (
    <RadioGroupContext.Provider value={{ ...radioGroupProviderProps }}>
      <RovingFocusGroup {...rovingProps}>
        <View style={styles.radioGroup} {...frameProps}>
          <RadioGroupItem value="2" id="2" />
          <RadioGroupItem value="3" id="3" />
          <RadioGroupItem value="4" id="4" />
        </View>
      </RovingFocusGroup>
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem(props: {
  value: string
  id: string
}) {
  const theme = useTheme()
  const { value, id } = props
  const {
    radioItemProviderProps,
    bubbleInput,
    rovingItemProps,
    itemFrameProps,
    isFormControl,
  } = useRadioGroupItem({
    radioGroupContext: RadioGroupContext,
    value,
    id,
  })

  return (
    <RadioGroupItemContext.Provider value={{ ...radioItemProviderProps }}>
      {isFormControl && bubbleInput}
      <RovingFocusGroup.Item {...rovingItemProps}>
        <Pressable
          style={{
            ...styles.radioGroupItem,
            ...{ borderColor: theme.borderColor.get() },
          }}
          {...itemFrameProps}
        >
          <RadioGroupItemIndicator />
        </Pressable>
      </RovingFocusGroup.Item>
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
    flexDirection: 'row',
    gap: 12,
  },
  radioGroupItem: {
    borderRadius: 1000_000_000,
    borderWidth: 2,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroupItemIndicator: {
    width: '33%',
    height: '33%',
    borderRadius: 1000,
  },
})
