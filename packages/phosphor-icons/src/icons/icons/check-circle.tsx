import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CheckCircleBold } from '../bold/check-circle-bold'
import { CheckCircleDuotone } from '../duotone/check-circle-duotone'
import { CheckCircleFill } from '../fill/check-circle-fill'
import { CheckCircleLight } from '../light/check-circle-light'
import { CheckCircleRegular } from '../regular/check-circle-regular'
import { CheckCircleThin } from '../thin/check-circle-thin'

const weightMap = {
  regular: CheckCircleRegular,
  bold: CheckCircleBold,
  duotone: CheckCircleDuotone,
  fill: CheckCircleFill,
  light: CheckCircleLight,
  thin: CheckCircleThin,
} as const

export const CheckCircle = (props: IconProps) => {
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
