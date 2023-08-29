import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Fieldset, InputProps, Label, SelectProps, Theme, XStack, useThemeName } from 'tamagui'
import { SelectField } from './SelectField'
import { z } from 'zod'
import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

const climbType = z.enum(['top_rope', 'lead_rope', 'boulder'] as const)
const location = z.enum(['Gowanus'] as const)

export const ClimbSchema = z.object({
  type: climbType,
  location: location,
})

export const ClimbField = (props: Pick<InputProps, 'size'>
) => {
  const {
    error,
    formState: { isSubmitting },
  } = useTsController<z.infer<typeof ClimbSchema>>()
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
        <Theme name={error?.type ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-street`}>
              Climb Type
            </Label>
            <Shake shakeKey={error?.type?.errorMessage}>
              <SelectField
                // might cause an issue
                disabled={disabled}
                options={[
                  {
                    name: 'Top Rope',
                    value: 'top_rope',
                  },
                  {
                    name: 'Lead Rope',
                    value: 'lead_rope',
                  },
                  {
                    name: 'Boulder',
                    value: 'boulder',
                  },
                ]}
                {...props}
              />
            </Shake>
            <FieldError message={error?.type?.errorMessage} />
          </Fieldset>
        </Theme>

        <Theme name={error?.location ? 'red' : themeName} forceClassName>
          <Fieldset $gtSm={{ fb: 0 }} f={1}>
            <Label theme="alt1" size={props.size || '$3'} htmlFor={`${id}-zip-code`}>
              Location
            </Label>
            <Shake shakeKey={error?.location?.errorMessage}>
              <SelectField
                disabled={true}
                options={[
                  {
                    name: 'Gowanus',
                    value: 'gowanus',
                  },
                ]}
                {...props}
              />
            </Shake>
            <FieldError message={error?.location?.errorMessage} />
          </Fieldset>
        </Theme>
      </XStack>
    </Fieldset>
  )
}
