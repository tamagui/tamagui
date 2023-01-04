import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EqualsBold } from '../bold/equals-bold'
import { EqualsDuotone } from '../duotone/equals-duotone'
import { EqualsFill } from '../fill/equals-fill'
import { EqualsLight } from '../light/equals-light'
import { EqualsRegular } from '../regular/equals-regular'
import { EqualsThin } from '../thin/equals-thin'

const weightMap = {
  regular: EqualsRegular,
  bold: EqualsBold,
  duotone: EqualsDuotone,
  fill: EqualsFill,
  light: EqualsLight,
  thin: EqualsThin,
} as const

export const Equals = (props: IconProps) => {
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
