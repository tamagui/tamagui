import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import type { SelectItemProps, SelectProps, SelectTriggerProps } from 'tamagui'
import {
  Select as TamaguiSelect,
  XStack,
  YStack,
  useProps,
  withStaticProperties,
} from 'tamagui'

export const SelectItem = ({ children, index, ...props }: SelectItemProps) => {
  return (
    <TamaguiSelect.Item
      index={index + 1}
      borderColor="transparent"
      hoverStyle={{
        bg: '$color2',
      }}
      {...props}
    >
      <TamaguiSelect.ItemText>{children}</TamaguiSelect.ItemText>
    </TamaguiSelect.Item>
  )
}

const SelectComponent = (
  propsIn: SelectProps & SelectTriggerProps & { placeholder?: string; variant?: 'pill' }
) => {
  const {
    placeholder,
    id,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    dir,
    name,
    autoComplete,
    size,
    children,
    onActiveChange,
    renderValue,
    variant,
    ...selectTriggerProps
  } = useProps(propsIn)
  const selectProps = {
    id,
    value,
    defaultValue,
    onActiveChange,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    dir,
    name,
    autoComplete,
    size,
    renderValue,
  } as SelectProps
  return (
    <TamaguiSelect {...selectProps}>
      <TamaguiSelect.Trigger
        iconAfter={ChevronDown}
        {...selectTriggerProps}
        {...(variant === 'pill' && {
          borderWidth: 1,
          borderColor: '$borderColor',
          rounded: '$10',
          width: 'auto',
          color: '$color9',
        })}
      >
        <TamaguiSelect.Value
          placeholder={placeholder}
          {...(variant === 'pill' && {
            theme: 'alt1',
          })}
        />
      </TamaguiSelect.Trigger>

      <TamaguiSelect.Content zIndex={1_000_000}>
        <TamaguiSelect.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', '$background0']}
            rounded="$4"
          />
        </TamaguiSelect.ScrollUpButton>

        <TamaguiSelect.Viewport
          opacity={1}
          y={0}
          enterStyle={{
            opacity: 0,
            scale: 0.98,
          }}
          exitStyle={{
            opacity: 0,
            scale: 0.98,
          }}
          bg="transparent"
          className="blur-medium"
          borderWidth={1}
          borderColor="$borderColor"
        >
          {children}
        </TamaguiSelect.Viewport>

        <TamaguiSelect.ScrollDownButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background0', '$background']}
            rounded="$4"
          />
        </TamaguiSelect.ScrollDownButton>
      </TamaguiSelect.Content>
    </TamaguiSelect>
  )
}

export const Select = withStaticProperties(SelectComponent, {
  Item: SelectItem,
  ItemText: TamaguiSelect.ItemText,
  Group: TamaguiSelect.Group,
  Label: TamaguiSelect.Label,
})
