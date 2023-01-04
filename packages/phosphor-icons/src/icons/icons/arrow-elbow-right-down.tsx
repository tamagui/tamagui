import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowRightDownBold } from '../bold/arrow-elbow-right-down-bold'
import { ArrowElbowRightDownDuotone } from '../duotone/arrow-elbow-right-down-duotone'
import { ArrowElbowRightDownFill } from '../fill/arrow-elbow-right-down-fill'
import { ArrowElbowRightDownLight } from '../light/arrow-elbow-right-down-light'
import { ArrowElbowRightDownRegular } from '../regular/arrow-elbow-right-down-regular'
import { ArrowElbowRightDownThin } from '../thin/arrow-elbow-right-down-thin'

const weightMap = {
  regular: ArrowElbowRightDownRegular,
  bold: ArrowElbowRightDownBold,
  duotone: ArrowElbowRightDownDuotone,
  fill: ArrowElbowRightDownFill,
  light: ArrowElbowRightDownLight,
  thin: ArrowElbowRightDownThin,
} as const

export const ArrowElbowRightDown = (props: IconProps) => {
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
