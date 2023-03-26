import { SizableText } from '@tamagui/text'
import { GetProps, styled } from '@tamagui/web'
import { useMemo } from 'react'
import {
  useFormContext,
  useFormState,
  FieldValues,
} from 'react-hook-form'

const MessageText = styled(SizableText, {
  name: "FormMessageText",
  color: "red"
})

export type MessageProps = GetProps<typeof MessageText> & { name: keyof FieldValues }

export const Message = ({ name, ...props }: MessageProps) => {
  const { control } = useFormContext()
  const { errors } = useFormState({ control, name })
  return useMemo(
    () => (errors[name]?.message ? <MessageText {...props}>{errors[name]?.message}</MessageText> : null),
    [errors[name]?.message]
  )
}
