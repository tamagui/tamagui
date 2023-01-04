import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TagSimpleBold } from '../bold/tag-simple-bold'
import { TagSimpleDuotone } from '../duotone/tag-simple-duotone'
import { TagSimpleFill } from '../fill/tag-simple-fill'
import { TagSimpleLight } from '../light/tag-simple-light'
import { TagSimpleRegular } from '../regular/tag-simple-regular'
import { TagSimpleThin } from '../thin/tag-simple-thin'

const weightMap = {
  regular: TagSimpleRegular,
  bold: TagSimpleBold,
  duotone: TagSimpleDuotone,
  fill: TagSimpleFill,
  light: TagSimpleLight,
  thin: TagSimpleThin,
} as const

export const TagSimple = (props: IconProps) => {
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
