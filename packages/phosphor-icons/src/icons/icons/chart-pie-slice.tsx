import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChartPieSliceBold } from '../bold/chart-pie-slice-bold'
import { ChartPieSliceDuotone } from '../duotone/chart-pie-slice-duotone'
import { ChartPieSliceFill } from '../fill/chart-pie-slice-fill'
import { ChartPieSliceLight } from '../light/chart-pie-slice-light'
import { ChartPieSliceRegular } from '../regular/chart-pie-slice-regular'
import { ChartPieSliceThin } from '../thin/chart-pie-slice-thin'

const weightMap = {
  regular: ChartPieSliceRegular,
  bold: ChartPieSliceBold,
  duotone: ChartPieSliceDuotone,
  fill: ChartPieSliceFill,
  light: ChartPieSliceLight,
  thin: ChartPieSliceThin,
} as const

export const ChartPieSlice = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
