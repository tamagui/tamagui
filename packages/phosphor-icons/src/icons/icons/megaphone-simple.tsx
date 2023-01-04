import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MegaphoneSimpleBold } from '../bold/megaphone-simple-bold'
import { MegaphoneSimpleDuotone } from '../duotone/megaphone-simple-duotone'
import { MegaphoneSimpleFill } from '../fill/megaphone-simple-fill'
import { MegaphoneSimpleLight } from '../light/megaphone-simple-light'
import { MegaphoneSimpleRegular } from '../regular/megaphone-simple-regular'
import { MegaphoneSimpleThin } from '../thin/megaphone-simple-thin'

const weightMap = {
  regular: MegaphoneSimpleRegular,
  bold: MegaphoneSimpleBold,
  duotone: MegaphoneSimpleDuotone,
  fill: MegaphoneSimpleFill,
  light: MegaphoneSimpleLight,
  thin: MegaphoneSimpleThin,
} as const

export const MegaphoneSimple = (props: IconProps) => {
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
