import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleUpLeftBold } from '../bold/arrow-circle-up-left-bold'
import { ArrowCircleUpLeftDuotone } from '../duotone/arrow-circle-up-left-duotone'
import { ArrowCircleUpLeftFill } from '../fill/arrow-circle-up-left-fill'
import { ArrowCircleUpLeftLight } from '../light/arrow-circle-up-left-light'
import { ArrowCircleUpLeftRegular } from '../regular/arrow-circle-up-left-regular'
import { ArrowCircleUpLeftThin } from '../thin/arrow-circle-up-left-thin'

const weightMap = {
  regular: ArrowCircleUpLeftRegular,
  bold: ArrowCircleUpLeftBold,
  duotone: ArrowCircleUpLeftDuotone,
  fill: ArrowCircleUpLeftFill,
  light: ArrowCircleUpLeftLight,
  thin: ArrowCircleUpLeftThin,
} as const

export const ArrowCircleUpLeft = (props: IconProps) => {
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
