import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Fieldset, Input, InputProps, Label, Theme, XStack, useThemeName } from 'tamagui'
import { z } from 'zod'
import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

export const AddressSchema = z.object({
  street: z.string().min(4),
  zipCode: z.string().regex(/\d{5}/, 'ZIP code should contain only 5 integers'),
})

export const AddressField = (props: Pick<InputProps, 'size'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<z.infer<typeof AddressSchema>>()
  const { label } = useFieldInfo()
  const id = useId()
  const themeName = useThemeName()
  const disabled = isSubmitting

  return (
    <Fieldset gap="$2">
      <Label theme="alt1" size="$3">
        {label}
      </Label>

      <XStack $sm={{ flexDirection: 'column' }} $gtSm={{ flexWrap: 'wrap' }} gap="$4">
        <Theme name={error?.street ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-street`}>
              Street
            </Label>
            <Shake shakeKey={error?.street?.errorMessage}>
              <Input
                disabled={disabled}
                placeholderTextColor="$color10"
                value={field.value?.street}
                onChangeText={(street) => field.onChange({ ...field.value, street })}
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder="e.g. 4116 Pretty View Lane"
                id={`${id}-street`}
                {...props}
              />
            </Shake>
            <FieldError message={error?.street?.errorMessage} />
          </Fieldset>
        </Theme>

        <Theme name={error?.zipCode ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-zip-code`}>
              US ZIP Code
            </Label>
            <Shake shakeKey={error?.zipCode?.errorMessage}>
              <Input
                disabled={disabled}
                placeholderTextColor="$color10"
                value={field.value?.zipCode}
                onChangeText={(zipCode) => field.onChange({ ...field.value, zipCode })}
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder="e.g. 12345"
                id={`${id}-zip-code`}
                {...props}
              />
            </Shake>
            <FieldError message={error?.zipCode?.errorMessage} />
          </Fieldset>
        </Theme>
      </XStack>
    </Fieldset>
  )
}
