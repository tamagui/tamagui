import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import {
  Adapt,
  Fieldset,
  Label,
  Select,
  SelectProps,
  Sheet,
  Theme,
  XStack,
  YStack,
  getFontSize,
  isWeb,
  useThemeName,
} from 'tamagui'
import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

type SelectItem = {
  value: string
  name: string
}

export const SelectField = ({
  options,
  native = true,
  ...props
}: {
  options: SelectItem[]
} & Pick<SelectProps, 'size' | 'native'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<string>()
  const { label, isOptional } = useFieldInfo()
  const themeName = useThemeName()
  const id = useId()
  const disabled = isSubmitting

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
            {label} {isOptional && `(Optional)`}
          </Label>
        )}
        <Shake shakeKey={error?.errorMessage}>
          <Select
            native={native}
            id={id}
            value={field.value}
            onValueChange={field.onChange}
            {...props}
          >
            <Select.Trigger width={180} iconAfter={ChevronDown}>
              <Select.Value placeholder="Something" />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet native modal dismissOnSnapToBottom>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton
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
                  colors={['$background', '$backgroundTransparent']}
                  borderRadius="$4"
                />
              </Select.ScrollUpButton>

              <Select.Viewport minWidth={200}>
                <XStack als="flex-start">
                  <Select.Group disabled={disabled} space="$0">
                    {/* <Select.Label>{label}</Select.Label> */}
                    {options.map((item, i) => {
                      return (
                        <Select.Item index={i} key={item.name} value={item.value}>
                          <Select.ItemText>{item.name}</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      )
                    })}
                  </Select.Group>
                  {/* special icon treatment for native */}
                  {native && isWeb && (
                    <YStack
                      position="absolute"
                      right={0}
                      top={0}
                      bottom={0}
                      alignItems="center"
                      justifyContent="center"
                      width={'$4'}
                      pointerEvents="none"
                    >
                      <ChevronDown size={getFontSize((props.size ?? '$true') as number)} />
                    </YStack>
                  )}
                </XStack>
              </Select.Viewport>

              <Select.ScrollDownButton
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
                  colors={['$backgroundTransparent', '$background']}
                  borderRadius="$4"
                />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
        </Shake>
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
