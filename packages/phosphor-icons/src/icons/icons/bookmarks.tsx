import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BookmarksBold } from '../bold/bookmarks-bold'
import { BookmarksDuotone } from '../duotone/bookmarks-duotone'
import { BookmarksFill } from '../fill/bookmarks-fill'
import { BookmarksLight } from '../light/bookmarks-light'
import { BookmarksRegular } from '../regular/bookmarks-regular'
import { BookmarksThin } from '../thin/bookmarks-thin'

const weightMap = {
  regular: BookmarksRegular,
  bold: BookmarksBold,
  duotone: BookmarksDuotone,
  fill: BookmarksFill,
  light: BookmarksLight,
  thin: BookmarksThin,
} as const

export const Bookmarks = (props: IconProps) => {
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
