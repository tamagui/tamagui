import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberOneBold } from '../bold/number-one-bold'
import { NumberOneDuotone } from '../duotone/number-one-duotone'
import { NumberOneFill } from '../fill/number-one-fill'
import { NumberOneLight } from '../light/number-one-light'
import { NumberOneRegular } from '../regular/number-one-regular'
import { NumberOneThin } from '../thin/number-one-thin'

const weightMap = {
  regular: NumberOneRegular,
  bold: NumberOneBold,
  duotone: NumberOneDuotone,
  fill: NumberOneFill,
  light: NumberOneLight,
  thin: NumberOneThin,
} as const

export const NumberOne = (props: IconProps) => {
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
