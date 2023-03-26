import { SizableText, SizableTextProps } from '@tamagui/text'
import { useMemo } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'

export type ValueProps = SizableTextProps & { name: keyof FieldValues }

export const Value = ({ name, ...props }: ValueProps) => {
  const { watch } = useFormContext()
  const value = watch(name)
  return useMemo(() => <SizableText {...props}>{value}</SizableText>, [value])
}
