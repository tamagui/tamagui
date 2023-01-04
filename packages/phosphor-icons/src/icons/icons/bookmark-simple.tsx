import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BookmarkSimpleBold } from '../bold/bookmark-simple-bold'
import { BookmarkSimpleDuotone } from '../duotone/bookmark-simple-duotone'
import { BookmarkSimpleFill } from '../fill/bookmark-simple-fill'
import { BookmarkSimpleLight } from '../light/bookmark-simple-light'
import { BookmarkSimpleRegular } from '../regular/bookmark-simple-regular'
import { BookmarkSimpleThin } from '../thin/bookmark-simple-thin'

const weightMap = {
  regular: BookmarkSimpleRegular,
  bold: BookmarkSimpleBold,
  duotone: BookmarkSimpleDuotone,
  fill: BookmarkSimpleFill,
  light: BookmarkSimpleLight,
  thin: BookmarkSimpleThin,
} as const

export const BookmarkSimple = (props: IconProps) => {
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
