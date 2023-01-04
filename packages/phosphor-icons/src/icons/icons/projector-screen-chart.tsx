import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ProjectorScreenChartBold } from '../bold/projector-screen-chart-bold'
import { ProjectorScreenChartDuotone } from '../duotone/projector-screen-chart-duotone'
import { ProjectorScreenChartFill } from '../fill/projector-screen-chart-fill'
import { ProjectorScreenChartLight } from '../light/projector-screen-chart-light'
import { ProjectorScreenChartRegular } from '../regular/projector-screen-chart-regular'
import { ProjectorScreenChartThin } from '../thin/projector-screen-chart-thin'

const weightMap = {
  regular: ProjectorScreenChartRegular,
  bold: ProjectorScreenChartBold,
  duotone: ProjectorScreenChartDuotone,
  fill: ProjectorScreenChartFill,
  light: ProjectorScreenChartLight,
  thin: ProjectorScreenChartThin,
} as const

export const ProjectorScreenChart = (props: IconProps) => {
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
