import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons-2'
import type { SelectItemProps, SelectProps, SelectTriggerProps } from 'tamagui'
import { Select as TamaguiSelect, YStack, useProps, withStaticProperties } from 'tamagui'

export const SelectItem = ({ children, index, ...props }: SelectItemProps) => {
  return (
    <TamaguiSelect.Item
      index={index + 1}
      minHeight={36}
      paddingHorizontal="$3"
      borderRadius="$3"
      borderColor="transparent"
      hoverStyle={{ backgroundColor: '$backgroundHover' }}
      focusStyle={{ backgroundColor: '$backgroundFocus' }}
      {...props}
    >
      <TamaguiSelect.ItemText>{children}</TamaguiSelect.ItemText>
    </TamaguiSelect.Item>
  )
}

const SelectComponent = (
  propsIn: SelectProps & SelectTriggerProps & { placeholder?: string }
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
    size,
    children,
    onActiveChange,
    renderValue,
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
    size,
    renderValue,
  } as SelectProps
  return (
    <TamaguiSelect {...selectProps} zIndex={1_000_000}>
      <TamaguiSelect.Trigger
        height={36}
        paddingHorizontal="$3"
        gap="$2"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$3"
        {...selectTriggerProps}
      >
        <TamaguiSelect.Value placeholder={placeholder} />
        <TamaguiSelect.Icon marginLeft="auto">
          <ChevronDown size={16} />
        </TamaguiSelect.Icon>
      </TamaguiSelect.Trigger>

      <TamaguiSelect.Content>
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
            position="absolute"
            inset={0}
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
          borderRadius="$4"
          padding="$1"
          boxShadow="0 12px 28px rgba(0, 0, 0, 0.18)"
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
            position="absolute"
            inset={0}
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
