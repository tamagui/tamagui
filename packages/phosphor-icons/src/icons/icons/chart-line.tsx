import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChartLineBold } from '../bold/chart-line-bold'
import { ChartLineDuotone } from '../duotone/chart-line-duotone'
import { ChartLineFill } from '../fill/chart-line-fill'
import { ChartLineLight } from '../light/chart-line-light'
import { ChartLineRegular } from '../regular/chart-line-regular'
import { ChartLineThin } from '../thin/chart-line-thin'

const weightMap = {
  regular: ChartLineRegular,
  bold: ChartLineBold,
  duotone: ChartLineDuotone,
  fill: ChartLineFill,
  light: ChartLineLight,
  thin: ChartLineThin,
} as const

export const ChartLine = (props: IconProps) => {
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
