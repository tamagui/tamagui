import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleUpBold } from '../bold/arrow-circle-up-bold'
import { ArrowCircleUpDuotone } from '../duotone/arrow-circle-up-duotone'
import { ArrowCircleUpFill } from '../fill/arrow-circle-up-fill'
import { ArrowCircleUpLight } from '../light/arrow-circle-up-light'
import { ArrowCircleUpRegular } from '../regular/arrow-circle-up-regular'
import { ArrowCircleUpThin } from '../thin/arrow-circle-up-thin'

const weightMap = {
  regular: ArrowCircleUpRegular,
  bold: ArrowCircleUpBold,
  duotone: ArrowCircleUpDuotone,
  fill: ArrowCircleUpFill,
  light: ArrowCircleUpLight,
  thin: ArrowCircleUpThin,
} as const

export const ArrowCircleUp = (props: IconProps) => {
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
