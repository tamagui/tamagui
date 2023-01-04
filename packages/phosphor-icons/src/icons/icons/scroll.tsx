import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ScrollBold } from '../bold/scroll-bold'
import { ScrollDuotone } from '../duotone/scroll-duotone'
import { ScrollFill } from '../fill/scroll-fill'
import { ScrollLight } from '../light/scroll-light'
import { ScrollRegular } from '../regular/scroll-regular'
import { ScrollThin } from '../thin/scroll-thin'

const weightMap = {
  regular: ScrollRegular,
  bold: ScrollBold,
  duotone: ScrollDuotone,
  fill: ScrollFill,
  light: ScrollLight,
  thin: ScrollThin,
} as const

export const Scroll = (props: IconProps) => {
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
