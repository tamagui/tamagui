import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleRightBold } from '../bold/arrow-circle-right-bold'
import { ArrowCircleRightDuotone } from '../duotone/arrow-circle-right-duotone'
import { ArrowCircleRightFill } from '../fill/arrow-circle-right-fill'
import { ArrowCircleRightLight } from '../light/arrow-circle-right-light'
import { ArrowCircleRightRegular } from '../regular/arrow-circle-right-regular'
import { ArrowCircleRightThin } from '../thin/arrow-circle-right-thin'

const weightMap = {
  regular: ArrowCircleRightRegular,
  bold: ArrowCircleRightBold,
  duotone: ArrowCircleRightDuotone,
  fill: ArrowCircleRightFill,
  light: ArrowCircleRightLight,
  thin: ArrowCircleRightThin,
} as const

export const ArrowCircleRight = (props: IconProps) => {
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
