import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleUpRightBold } from '../bold/arrow-circle-up-right-bold'
import { ArrowCircleUpRightDuotone } from '../duotone/arrow-circle-up-right-duotone'
import { ArrowCircleUpRightFill } from '../fill/arrow-circle-up-right-fill'
import { ArrowCircleUpRightLight } from '../light/arrow-circle-up-right-light'
import { ArrowCircleUpRightRegular } from '../regular/arrow-circle-up-right-regular'
import { ArrowCircleUpRightThin } from '../thin/arrow-circle-up-right-thin'

const weightMap = {
  regular: ArrowCircleUpRightRegular,
  bold: ArrowCircleUpRightBold,
  duotone: ArrowCircleUpRightDuotone,
  fill: ArrowCircleUpRightFill,
  light: ArrowCircleUpRightLight,
  thin: ArrowCircleUpRightThin,
} as const

export const ArrowCircleUpRight = (props: IconProps) => {
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
