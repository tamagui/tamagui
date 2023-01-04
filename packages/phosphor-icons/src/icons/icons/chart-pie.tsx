import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChartPieBold } from '../bold/chart-pie-bold'
import { ChartPieDuotone } from '../duotone/chart-pie-duotone'
import { ChartPieFill } from '../fill/chart-pie-fill'
import { ChartPieLight } from '../light/chart-pie-light'
import { ChartPieRegular } from '../regular/chart-pie-regular'
import { ChartPieThin } from '../thin/chart-pie-thin'

const weightMap = {
  regular: ChartPieRegular,
  bold: ChartPieBold,
  duotone: ChartPieDuotone,
  fill: ChartPieFill,
  light: ChartPieLight,
  thin: ChartPieThin,
} as const

export const ChartPie = (props: IconProps) => {
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
