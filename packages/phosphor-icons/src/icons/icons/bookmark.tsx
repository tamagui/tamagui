import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BookmarkBold } from '../bold/bookmark-bold'
import { BookmarkDuotone } from '../duotone/bookmark-duotone'
import { BookmarkFill } from '../fill/bookmark-fill'
import { BookmarkLight } from '../light/bookmark-light'
import { BookmarkRegular } from '../regular/bookmark-regular'
import { BookmarkThin } from '../thin/bookmark-thin'

const weightMap = {
  regular: BookmarkRegular,
  bold: BookmarkBold,
  duotone: BookmarkDuotone,
  fill: BookmarkFill,
  light: BookmarkLight,
  thin: BookmarkThin,
} as const

export const Bookmark = (props: IconProps) => {
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
