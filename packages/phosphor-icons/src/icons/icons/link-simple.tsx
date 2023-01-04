import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkSimpleBold } from '../bold/link-simple-bold'
import { LinkSimpleDuotone } from '../duotone/link-simple-duotone'
import { LinkSimpleFill } from '../fill/link-simple-fill'
import { LinkSimpleLight } from '../light/link-simple-light'
import { LinkSimpleRegular } from '../regular/link-simple-regular'
import { LinkSimpleThin } from '../thin/link-simple-thin'

const weightMap = {
  regular: LinkSimpleRegular,
  bold: LinkSimpleBold,
  duotone: LinkSimpleDuotone,
  fill: LinkSimpleFill,
  light: LinkSimpleLight,
  thin: LinkSimpleThin,
} as const

export const LinkSimple = (props: IconProps) => {
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
