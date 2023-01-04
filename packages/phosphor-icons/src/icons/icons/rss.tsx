import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RssBold } from '../bold/rss-bold'
import { RssDuotone } from '../duotone/rss-duotone'
import { RssFill } from '../fill/rss-fill'
import { RssLight } from '../light/rss-light'
import { RssRegular } from '../regular/rss-regular'
import { RssThin } from '../thin/rss-thin'

const weightMap = {
  regular: RssRegular,
  bold: RssBold,
  duotone: RssDuotone,
  fill: RssFill,
  light: RssLight,
  thin: RssThin,
} as const

export const Rss = (props: IconProps) => {
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
