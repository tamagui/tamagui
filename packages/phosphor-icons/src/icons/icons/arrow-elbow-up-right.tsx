import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowUpRightBold } from '../bold/arrow-elbow-up-right-bold'
import { ArrowElbowUpRightDuotone } from '../duotone/arrow-elbow-up-right-duotone'
import { ArrowElbowUpRightFill } from '../fill/arrow-elbow-up-right-fill'
import { ArrowElbowUpRightLight } from '../light/arrow-elbow-up-right-light'
import { ArrowElbowUpRightRegular } from '../regular/arrow-elbow-up-right-regular'
import { ArrowElbowUpRightThin } from '../thin/arrow-elbow-up-right-thin'

const weightMap = {
  regular: ArrowElbowUpRightRegular,
  bold: ArrowElbowUpRightBold,
  duotone: ArrowElbowUpRightDuotone,
  fill: ArrowElbowUpRightFill,
  light: ArrowElbowUpRightLight,
  thin: ArrowElbowUpRightThin,
} as const

export const ArrowElbowUpRight = (props: IconProps) => {
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
