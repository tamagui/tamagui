import { Check } from '@tamagui/lucide-icons'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import {
  Checkbox,
  CheckboxProps,
  CheckedState,
  Fieldset,
  Label,
  Theme,
  XStack,
  useThemeName,
} from 'tamagui'
import { FieldError } from '../FieldError'

export const BooleanCheckboxField = (props: Pick<CheckboxProps, 'size' | 'native'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<CheckedState>()
  const { label, isOptional } = useFieldInfo()
  const id = useId()
  const themeName = useThemeName()
  const disabled = isSubmitting

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset>
        <XStack gap="$4">
          {!!label && (
            <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
              {label} {isOptional && `(Optional)`}
            </Label>
          )}
          <Checkbox
            disabled={disabled}
            native
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
            ref={field.ref}
            id={id}
            {...props}
          >
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        </XStack>
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
