import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PresentationChartBold } from '../bold/presentation-chart-bold'
import { PresentationChartDuotone } from '../duotone/presentation-chart-duotone'
import { PresentationChartFill } from '../fill/presentation-chart-fill'
import { PresentationChartLight } from '../light/presentation-chart-light'
import { PresentationChartRegular } from '../regular/presentation-chart-regular'
import { PresentationChartThin } from '../thin/presentation-chart-thin'

const weightMap = {
  regular: PresentationChartRegular,
  bold: PresentationChartBold,
  duotone: PresentationChartDuotone,
  fill: PresentationChartFill,
  light: PresentationChartLight,
  thin: PresentationChartThin,
} as const

export const PresentationChart = (props: IconProps) => {
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
