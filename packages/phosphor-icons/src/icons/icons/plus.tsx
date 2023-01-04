import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlusBold } from '../bold/plus-bold'
import { PlusDuotone } from '../duotone/plus-duotone'
import { PlusFill } from '../fill/plus-fill'
import { PlusLight } from '../light/plus-light'
import { PlusRegular } from '../regular/plus-regular'
import { PlusThin } from '../thin/plus-thin'

const weightMap = {
  regular: PlusRegular,
  bold: PlusBold,
  duotone: PlusDuotone,
  fill: PlusFill,
  light: PlusLight,
  thin: PlusThin,
} as const

export const Plus = (props: IconProps) => {
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
