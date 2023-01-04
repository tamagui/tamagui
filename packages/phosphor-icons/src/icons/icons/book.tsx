import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BookBold } from '../bold/book-bold'
import { BookDuotone } from '../duotone/book-duotone'
import { BookFill } from '../fill/book-fill'
import { BookLight } from '../light/book-light'
import { BookRegular } from '../regular/book-regular'
import { BookThin } from '../thin/book-thin'

const weightMap = {
  regular: BookRegular,
  bold: BookBold,
  duotone: BookDuotone,
  fill: BookFill,
  light: BookLight,
  thin: BookThin,
} as const

export const Book = (props: IconProps) => {
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
