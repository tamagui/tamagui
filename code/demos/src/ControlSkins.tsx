import { Checkbox as CheckboxBehavior } from '@tamagui/checkbox'
import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'
import { Switch as SwitchBehavior } from '@tamagui/switch'
import { Tabs as TabsBehavior } from '@tamagui/tabs'
import { getButtonSized } from '@tamagui/get-button-sized'
import { getVariableValue, resolveTokenSize, styled, withStaticProperties } from 'tamagui'

export const CheckboxFrame = styled(CheckboxBehavior, {
  name: 'DemoCheckboxFrame',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColorPress',
  },

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },

  variants: {
    size: {
      Size: (value, extras) => {
        const size = Math.round(
          getVariableValue(
            resolveTokenSize(value, { tokens: extras.tokens, font: extras.font! }).frame
              .size
          ) * 0.5
        )
        return {
          width: size,
          height: size,
          borderRadius: Math.max(3, Math.round(size / 5)),
        }
      },
    },

    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  } as const,
})

export const CheckboxIndicator = styled(CheckboxBehavior.Indicator, {
  name: 'DemoCheckboxIndicator',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Checkbox = withStaticProperties(CheckboxFrame, {
  Indicator: CheckboxIndicator,
})

export const RadioGroupFrame = styled(RadioGroupBehavior, {
  name: 'DemoRadioGroupFrame',
})

export const RadioGroupItem = styled(RadioGroupBehavior.Item, {
  name: 'DemoRadioGroupItem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: 1000,
  borderWidth: 1,

  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColorPress',
  },

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },

  variants: {
    size: {
      Size: (value, extras) => {
        const size = Math.round(
          getVariableValue(
            resolveTokenSize(value, { tokens: extras.tokens, font: extras.font! }).frame
              .size
          ) * 0.5
        )
        return {
          width: size,
          height: size,
        }
      },
    },

    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  } as const,
})

export const RadioGroupIndicator = styled(RadioGroupBehavior.Indicator, {
  name: 'DemoRadioGroupIndicator',
  width: '50%',
  height: '50%',
  borderRadius: 1000,
  backgroundColor: '$color',
})

export const RadioGroup = withStaticProperties(RadioGroupFrame, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
})

export const SwitchFrame = styled(SwitchBehavior, {
  name: 'DemoSwitchFrame',
  backgroundColor: '$background',
  borderRadius: 1000,

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },

  variants: {
    size: {
      Size: (value, extras) => {
        const height = Math.round(
          getVariableValue(
            resolveTokenSize(value, { tokens: extras.tokens, font: extras.font! }).frame
              .size
          ) * 0.65
        )
        return {
          width: height * 2,
          height,
          minHeight: height,
        }
      },
    },
  } as const,
})

export const SwitchThumb = styled(SwitchBehavior.Thumb, {
  name: 'DemoSwitchThumb',
  backgroundColor: '$color',
  borderRadius: 1000,

  variants: {
    size: {
      Size: (value, extras) => {
        const size = Math.round(
          getVariableValue(
            resolveTokenSize(value, { tokens: extras.tokens, font: extras.font! }).frame
              .size
          ) * 0.65
        )
        return {
          width: size,
          height: size,
        }
      },
    },
  } as const,
})

export const Switch = withStaticProperties(SwitchFrame, {
  Thumb: SwitchThumb,
})

export const TabsFrame = styled(TabsBehavior, {
  name: 'DemoTabsFrame',
})

export const TabsList = styled(TabsBehavior.List, {
  name: 'DemoTabsList',
})

export const TabsTab = styled(TabsBehavior.Tab, {
  name: 'DemoTabsTab',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$background',
  borderWidth: 0,
  cursor: 'pointer',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  userSelect: 'none',

  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
  },

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
    zIndex: 10,
  },

  variants: {
    size: {
      true: getButtonSized,
      Size: getButtonSized,
    },

    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  } as const,
})

export const TabsContent = styled(TabsBehavior.Content, {
  name: 'DemoTabsContent',
})

export const Tabs = withStaticProperties(TabsFrame, {
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})
