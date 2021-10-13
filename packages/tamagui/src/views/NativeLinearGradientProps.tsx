import * as React from 'react'
import { View } from 'react-native'

export type NativeLinearGradientProps = React.ComponentProps<typeof View> &
  React.PropsWithChildren<{
    colors: (number | string)[]
    locations?: number[] | null
    start?: NativeLinearGradientPoint | null
    end?: NativeLinearGradientPoint | null
  }>

export type NativeLinearGradientPoint = [number, number]
