import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TagBold } from '../bold/tag-bold'
import { TagDuotone } from '../duotone/tag-duotone'
import { TagFill } from '../fill/tag-fill'
import { TagLight } from '../light/tag-light'
import { TagRegular } from '../regular/tag-regular'
import { TagThin } from '../thin/tag-thin'

const weightMap = {
  regular: TagRegular,
  bold: TagBold,
  duotone: TagDuotone,
  fill: TagFill,
  light: TagLight,
  thin: TagThin,
} as const

export const Tag = (props: IconProps) => {
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
