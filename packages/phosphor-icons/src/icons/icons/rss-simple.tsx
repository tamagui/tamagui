import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RssSimpleBold } from '../bold/rss-simple-bold'
import { RssSimpleDuotone } from '../duotone/rss-simple-duotone'
import { RssSimpleFill } from '../fill/rss-simple-fill'
import { RssSimpleLight } from '../light/rss-simple-light'
import { RssSimpleRegular } from '../regular/rss-simple-regular'
import { RssSimpleThin } from '../thin/rss-simple-thin'

const weightMap = {
  regular: RssSimpleRegular,
  bold: RssSimpleBold,
  duotone: RssSimpleDuotone,
  fill: RssSimpleFill,
  light: RssSimpleLight,
  thin: RssSimpleThin,
} as const

export const RssSimple = (props: IconProps) => {
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
