import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowRightUpBold } from '../bold/arrow-elbow-right-up-bold'
import { ArrowElbowRightUpDuotone } from '../duotone/arrow-elbow-right-up-duotone'
import { ArrowElbowRightUpFill } from '../fill/arrow-elbow-right-up-fill'
import { ArrowElbowRightUpLight } from '../light/arrow-elbow-right-up-light'
import { ArrowElbowRightUpRegular } from '../regular/arrow-elbow-right-up-regular'
import { ArrowElbowRightUpThin } from '../thin/arrow-elbow-right-up-thin'

const weightMap = {
  regular: ArrowElbowRightUpRegular,
  bold: ArrowElbowRightUpBold,
  duotone: ArrowElbowRightUpDuotone,
  fill: ArrowElbowRightUpFill,
  light: ArrowElbowRightUpLight,
  thin: ArrowElbowRightUpThin,
} as const

export const ArrowElbowRightUp = (props: IconProps) => {
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
