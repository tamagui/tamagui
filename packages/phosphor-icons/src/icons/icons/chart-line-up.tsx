import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChartLineUpBold } from '../bold/chart-line-up-bold'
import { ChartLineUpDuotone } from '../duotone/chart-line-up-duotone'
import { ChartLineUpFill } from '../fill/chart-line-up-fill'
import { ChartLineUpLight } from '../light/chart-line-up-light'
import { ChartLineUpRegular } from '../regular/chart-line-up-regular'
import { ChartLineUpThin } from '../thin/chart-line-up-thin'

const weightMap = {
  regular: ChartLineUpRegular,
  bold: ChartLineUpBold,
  duotone: ChartLineUpDuotone,
  fill: ChartLineUpFill,
  light: ChartLineUpLight,
  thin: ChartLineUpThin,
} as const

export const ChartLineUp = (props: IconProps) => {
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
