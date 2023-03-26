import { Form, FormTriggerProps } from '@tamagui/form'
import { useFormState } from 'react-hook-form'

export const Trigger = (props: FormTriggerProps) => {
  const { isValid } = useFormState()
  return <Form.Trigger disabled={!isValid} {...props} />
}
