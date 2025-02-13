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
      bc="transparent"
      hoverStyle={{
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}
      $theme-dark={{
        backgroundColor: 'rgba(0,0,0,0.2)',
      }}
      $theme-active={{
        backgroundColor: 'red',
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
    variant,
    color,
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
  }
  return (
    <TamaguiSelect {...selectProps}>
      <TamaguiSelect.Trigger
        iconAfter={ChevronDown}
        {...selectTriggerProps}
        {...(variant === 'pill' && {
          bw: 1,
          bc: '$borderColor',
          br: '$10',
          w: 'auto',
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
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', '$background0']}
            borderRadius="$4"
          />
        </TamaguiSelect.ScrollUpButton>

        <TamaguiSelect.Viewport
          animation="quicker"
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
          bw={1}
        >
          <XStack fullscreen zi={0} bg="$background" o={0.7} />
          {children}
        </TamaguiSelect.Viewport>

        <TamaguiSelect.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background0', '$background']}
            borderRadius="$4"
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
