import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BookBookmarkBold } from '../bold/book-bookmark-bold'
import { BookBookmarkDuotone } from '../duotone/book-bookmark-duotone'
import { BookBookmarkFill } from '../fill/book-bookmark-fill'
import { BookBookmarkLight } from '../light/book-bookmark-light'
import { BookBookmarkRegular } from '../regular/book-bookmark-regular'
import { BookBookmarkThin } from '../thin/book-bookmark-thin'

const weightMap = {
  regular: BookBookmarkRegular,
  bold: BookBookmarkBold,
  duotone: BookBookmarkDuotone,
  fill: BookBookmarkFill,
  light: BookBookmarkLight,
  thin: BookBookmarkThin,
} as const

export const BookBookmark = (props: IconProps) => {
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
