import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowElbowUpLeftBold } from '../bold/arrow-elbow-up-left-bold'
import { ArrowElbowUpLeftDuotone } from '../duotone/arrow-elbow-up-left-duotone'
import { ArrowElbowUpLeftFill } from '../fill/arrow-elbow-up-left-fill'
import { ArrowElbowUpLeftLight } from '../light/arrow-elbow-up-left-light'
import { ArrowElbowUpLeftRegular } from '../regular/arrow-elbow-up-left-regular'
import { ArrowElbowUpLeftThin } from '../thin/arrow-elbow-up-left-thin'

const weightMap = {
  regular: ArrowElbowUpLeftRegular,
  bold: ArrowElbowUpLeftBold,
  duotone: ArrowElbowUpLeftDuotone,
  fill: ArrowElbowUpLeftFill,
  light: ArrowElbowUpLeftLight,
  thin: ArrowElbowUpLeftThin,
} as const

export const ArrowElbowUpLeft = (props: IconProps) => {
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
