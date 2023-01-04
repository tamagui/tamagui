import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RobotBold } from '../bold/robot-bold'
import { RobotDuotone } from '../duotone/robot-duotone'
import { RobotFill } from '../fill/robot-fill'
import { RobotLight } from '../light/robot-light'
import { RobotRegular } from '../regular/robot-regular'
import { RobotThin } from '../thin/robot-thin'

const weightMap = {
  regular: RobotRegular,
  bold: RobotBold,
  duotone: RobotDuotone,
  fill: RobotFill,
  light: RobotLight,
  thin: RobotThin,
} as const

export const Robot = (props: IconProps) => {
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
