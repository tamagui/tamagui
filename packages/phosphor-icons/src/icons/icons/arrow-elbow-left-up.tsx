import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowLeftUpBold } from '../bold/arrow-elbow-left-up-bold'
import { ArrowElbowLeftUpDuotone } from '../duotone/arrow-elbow-left-up-duotone'
import { ArrowElbowLeftUpFill } from '../fill/arrow-elbow-left-up-fill'
import { ArrowElbowLeftUpLight } from '../light/arrow-elbow-left-up-light'
import { ArrowElbowLeftUpRegular } from '../regular/arrow-elbow-left-up-regular'
import { ArrowElbowLeftUpThin } from '../thin/arrow-elbow-left-up-thin'

const weightMap = {
  regular: ArrowElbowLeftUpRegular,
  bold: ArrowElbowLeftUpBold,
  duotone: ArrowElbowLeftUpDuotone,
  fill: ArrowElbowLeftUpFill,
  light: ArrowElbowLeftUpLight,
  thin: ArrowElbowLeftUpThin,
} as const

export const ArrowElbowLeftUp = (props: IconProps) => {
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
