import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowDownLeftBold } from '../bold/arrow-elbow-down-left-bold'
import { ArrowElbowDownLeftDuotone } from '../duotone/arrow-elbow-down-left-duotone'
import { ArrowElbowDownLeftFill } from '../fill/arrow-elbow-down-left-fill'
import { ArrowElbowDownLeftLight } from '../light/arrow-elbow-down-left-light'
import { ArrowElbowDownLeftRegular } from '../regular/arrow-elbow-down-left-regular'
import { ArrowElbowDownLeftThin } from '../thin/arrow-elbow-down-left-thin'

const weightMap = {
  regular: ArrowElbowDownLeftRegular,
  bold: ArrowElbowDownLeftBold,
  duotone: ArrowElbowDownLeftDuotone,
  fill: ArrowElbowDownLeftFill,
  light: ArrowElbowDownLeftLight,
  thin: ArrowElbowDownLeftThin,
} as const

export const ArrowElbowDownLeft = (props: IconProps) => {
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
