import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BookOpenBold } from '../bold/book-open-bold'
import { BookOpenDuotone } from '../duotone/book-open-duotone'
import { BookOpenFill } from '../fill/book-open-fill'
import { BookOpenLight } from '../light/book-open-light'
import { BookOpenRegular } from '../regular/book-open-regular'
import { BookOpenThin } from '../thin/book-open-thin'

const weightMap = {
  regular: BookOpenRegular,
  bold: BookOpenBold,
  duotone: BookOpenDuotone,
  fill: BookOpenFill,
  light: BookOpenLight,
  thin: BookOpenThin,
} as const

export const BookOpen = (props: IconProps) => {
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
