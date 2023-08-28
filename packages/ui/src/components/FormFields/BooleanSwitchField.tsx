import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Fieldset, Label, Switch, SwitchProps, Theme, useThemeName } from 'tamagui'
import { FieldError } from '../FieldError'

export const BooleanSwitchField = (props: Pick<SwitchProps, 'size' | 'native'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<boolean>()
  const { label, isOptional } = useFieldInfo()
  const id = useId()
  const themeName = useThemeName()
  const disabled = isSubmitting

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset ai="flex-start">
        {!!label && (
          <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
            {label} {isOptional && `(Optional)`}
          </Label>
        )}

        <Switch
          disabled={disabled}
          native
          checked={field.value}
          onCheckedChange={(checked) => field.onChange(checked)}
          ref={field.ref}
          id={id}
          {...props}
        >
          <Switch.Thumb animation="100ms" />
        </Switch>

        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
