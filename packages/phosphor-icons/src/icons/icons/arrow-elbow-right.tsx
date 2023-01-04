import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowRightBold } from '../bold/arrow-elbow-right-bold'
import { ArrowElbowRightDuotone } from '../duotone/arrow-elbow-right-duotone'
import { ArrowElbowRightFill } from '../fill/arrow-elbow-right-fill'
import { ArrowElbowRightLight } from '../light/arrow-elbow-right-light'
import { ArrowElbowRightRegular } from '../regular/arrow-elbow-right-regular'
import { ArrowElbowRightThin } from '../thin/arrow-elbow-right-thin'

const weightMap = {
  regular: ArrowElbowRightRegular,
  bold: ArrowElbowRightBold,
  duotone: ArrowElbowRightDuotone,
  fill: ArrowElbowRightFill,
  light: ArrowElbowRightLight,
  thin: ArrowElbowRightThin,
} as const

export const ArrowElbowRight = (props: IconProps) => {
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
