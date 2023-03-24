import { Text, TextProps } from '@tamagui/web'
import { useEffect, useMemo } from 'react'
import {
  UseFormStateProps,
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form'

export const Message = ({ name, ...props }: TextProps & { name: string }) => {
  const { control } = useFormContext()
  const { errors } = useFormState({ control, name })
  return useMemo(
    () => (errors[name]?.message ? <Text {...props}>{errors[name]?.message}</Text> : null),
    [errors[name]?.message]
  )
}
