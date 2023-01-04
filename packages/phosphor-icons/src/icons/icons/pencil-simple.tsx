import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PencilSimpleBold } from '../bold/pencil-simple-bold'
import { PencilSimpleDuotone } from '../duotone/pencil-simple-duotone'
import { PencilSimpleFill } from '../fill/pencil-simple-fill'
import { PencilSimpleLight } from '../light/pencil-simple-light'
import { PencilSimpleRegular } from '../regular/pencil-simple-regular'
import { PencilSimpleThin } from '../thin/pencil-simple-thin'

const weightMap = {
  regular: PencilSimpleRegular,
  bold: PencilSimpleBold,
  duotone: PencilSimpleDuotone,
  fill: PencilSimpleFill,
  light: PencilSimpleLight,
  thin: PencilSimpleThin,
} as const

export const PencilSimple = (props: IconProps) => {
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
