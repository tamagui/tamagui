import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChartBarHorizontalBold } from '../bold/chart-bar-horizontal-bold'
import { ChartBarHorizontalDuotone } from '../duotone/chart-bar-horizontal-duotone'
import { ChartBarHorizontalFill } from '../fill/chart-bar-horizontal-fill'
import { ChartBarHorizontalLight } from '../light/chart-bar-horizontal-light'
import { ChartBarHorizontalRegular } from '../regular/chart-bar-horizontal-regular'
import { ChartBarHorizontalThin } from '../thin/chart-bar-horizontal-thin'

const weightMap = {
  regular: ChartBarHorizontalRegular,
  bold: ChartBarHorizontalBold,
  duotone: ChartBarHorizontalDuotone,
  fill: ChartBarHorizontalFill,
  light: ChartBarHorizontalLight,
  thin: ChartBarHorizontalThin,
} as const

export const ChartBarHorizontal = (props: IconProps) => {
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
