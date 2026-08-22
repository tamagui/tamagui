import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons-2'
import type { SelectItemProps, SelectProps, SelectTriggerProps } from 'tamagui'
import { Select as TamaguiSelect, YStack, useProps, withStaticProperties } from 'tamagui'

export const SelectItem = ({ children, ...props }: SelectItemProps) => {
  return (
    <TamaguiSelect.Item
      minHeight={36}
      paddingHorizontal="3"
      borderRadius="3"
      borderColor="transparent"
      backgroundColor="hover:background-hover focus:background-focus"
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
        paddingHorizontal="3"
        gap="2"
        backgroundColor="background"
        borderWidth={1}
        borderColor="border-color"
        borderRadius="3"
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
          height="3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            position="absolute"
            inset={0}
            rounded="4"
            colors={['background', 'background0']}
          />
        </TamaguiSelect.ScrollUpButton>

        <TamaguiSelect.Viewport
          opacity="1 enter:0 exit:0"
          y={0}
          scale="enter:0.98 exit:0.98"
          bg="transparent"
          borderWidth={1}
          borderColor="border-color"
          borderRadius="4"
          padding="1"
          boxShadow="0 12px 28px rgba(0, 0, 0, 0.18)"
          className="blur-medium"
        >
          {children}
        </TamaguiSelect.Viewport>

        <TamaguiSelect.ScrollDownButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            position="absolute"
            inset={0}
            rounded="4"
            colors={['background0', 'background']}
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
