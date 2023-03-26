import { SizableText, SizableTextProps } from '@tamagui/text'
import { useMemo } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useField } from './fieldContext'

export type ValueProps = SizableTextProps & { name: keyof FieldValues }

export const Value = ({ name, ...props }: ValueProps) => {
  const { name: nameField } = useField()
  const { watch } = useFormContext()
  const value = watch(name ?? nameField)
  return useMemo(() => <SizableText {...props}>{value}</SizableText>, [value])
}
