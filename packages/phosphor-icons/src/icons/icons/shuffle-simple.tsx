import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShuffleSimpleBold } from '../bold/shuffle-simple-bold'
import { ShuffleSimpleDuotone } from '../duotone/shuffle-simple-duotone'
import { ShuffleSimpleFill } from '../fill/shuffle-simple-fill'
import { ShuffleSimpleLight } from '../light/shuffle-simple-light'
import { ShuffleSimpleRegular } from '../regular/shuffle-simple-regular'
import { ShuffleSimpleThin } from '../thin/shuffle-simple-thin'

const weightMap = {
  regular: ShuffleSimpleRegular,
  bold: ShuffleSimpleBold,
  duotone: ShuffleSimpleDuotone,
  fill: ShuffleSimpleFill,
  light: ShuffleSimpleLight,
  thin: ShuffleSimpleThin,
} as const

export const ShuffleSimple = (props: IconProps) => {
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
