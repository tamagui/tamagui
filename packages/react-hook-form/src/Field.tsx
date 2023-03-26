import { YStack, YStackProps } from '@tamagui/stacks'
import { PropsWithChildren } from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'

import { fieldContext } from './fieldContext'

export type FieldControlledProps<TFieldValues extends FieldValues = FieldValues> =
  PropsWithChildren<{ name: FieldPath<TFieldValues> }> & YStackProps

export function FieldControlled<TFieldValues extends FieldValues = FieldValues>({
  children,
  name,
  ...props
}: FieldControlledProps<TFieldValues>) {
  return (
    <fieldContext.Provider value={{ name }}>
      <YStack {...props}>{children}</YStack>
    </fieldContext.Provider>
  )
}
