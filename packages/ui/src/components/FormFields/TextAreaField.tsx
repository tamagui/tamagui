import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Label, TextArea, TextAreaProps, Theme, Fieldset, useThemeName } from 'tamagui'
import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

export const TextAreaField = (props: Pick<TextAreaProps, 'size' | 'autoFocus'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<string>()
  const { label, isOptional, placeholder } = useFieldInfo()
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
          <TextArea
            disabled={disabled}
            placeholderTextColor="$color10"
            value={field.value}
            onChangeText={(text) => field.onChange(text)}
            onBlur={field.onBlur}
            ref={field.ref}
            placeholder={placeholder}
            id={id}
            rows={5}
            // temp fix
            height={150}
            {...props}
          />
        </Shake>
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
