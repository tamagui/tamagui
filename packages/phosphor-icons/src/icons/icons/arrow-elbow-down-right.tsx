import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowDownRightBold } from '../bold/arrow-elbow-down-right-bold'
import { ArrowElbowDownRightDuotone } from '../duotone/arrow-elbow-down-right-duotone'
import { ArrowElbowDownRightFill } from '../fill/arrow-elbow-down-right-fill'
import { ArrowElbowDownRightLight } from '../light/arrow-elbow-down-right-light'
import { ArrowElbowDownRightRegular } from '../regular/arrow-elbow-down-right-regular'
import { ArrowElbowDownRightThin } from '../thin/arrow-elbow-down-right-thin'

const weightMap = {
  regular: ArrowElbowDownRightRegular,
  bold: ArrowElbowDownRightBold,
  duotone: ArrowElbowDownRightDuotone,
  fill: ArrowElbowDownRightFill,
  light: ArrowElbowDownRightLight,
  thin: ArrowElbowDownRightThin,
} as const

export const ArrowElbowDownRight = (props: IconProps) => {
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
