import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChartBarBold } from '../bold/chart-bar-bold'
import { ChartBarDuotone } from '../duotone/chart-bar-duotone'
import { ChartBarFill } from '../fill/chart-bar-fill'
import { ChartBarLight } from '../light/chart-bar-light'
import { ChartBarRegular } from '../regular/chart-bar-regular'
import { ChartBarThin } from '../thin/chart-bar-thin'

const weightMap = {
  regular: ChartBarRegular,
  bold: ChartBarBold,
  duotone: ChartBarDuotone,
  fill: ChartBarFill,
  light: ChartBarLight,
  thin: ChartBarThin,
} as const

export const ChartBar = (props: IconProps) => {
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
