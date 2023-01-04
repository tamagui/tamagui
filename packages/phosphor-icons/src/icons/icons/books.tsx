import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BooksBold } from '../bold/books-bold'
import { BooksDuotone } from '../duotone/books-duotone'
import { BooksFill } from '../fill/books-fill'
import { BooksLight } from '../light/books-light'
import { BooksRegular } from '../regular/books-regular'
import { BooksThin } from '../thin/books-thin'

const weightMap = {
  regular: BooksRegular,
  bold: BooksBold,
  duotone: BooksDuotone,
  fill: BooksFill,
  light: BooksLight,
  thin: BooksThin,
} as const

export const Books = (props: IconProps) => {
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
