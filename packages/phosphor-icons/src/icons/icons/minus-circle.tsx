import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MinusCircleBold } from '../bold/minus-circle-bold'
import { MinusCircleDuotone } from '../duotone/minus-circle-duotone'
import { MinusCircleFill } from '../fill/minus-circle-fill'
import { MinusCircleLight } from '../light/minus-circle-light'
import { MinusCircleRegular } from '../regular/minus-circle-regular'
import { MinusCircleThin } from '../thin/minus-circle-thin'

const weightMap = {
  regular: MinusCircleRegular,
  bold: MinusCircleBold,
  duotone: MinusCircleDuotone,
  fill: MinusCircleFill,
  light: MinusCircleLight,
  thin: MinusCircleThin,
} as const

export const MinusCircle = (props: IconProps) => {
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
