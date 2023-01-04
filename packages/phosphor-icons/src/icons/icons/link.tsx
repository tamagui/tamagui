import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkBold } from '../bold/link-bold'
import { LinkDuotone } from '../duotone/link-duotone'
import { LinkFill } from '../fill/link-fill'
import { LinkLight } from '../light/link-light'
import { LinkRegular } from '../regular/link-regular'
import { LinkThin } from '../thin/link-thin'

const weightMap = {
  regular: LinkRegular,
  bold: LinkBold,
  duotone: LinkDuotone,
  fill: LinkFill,
  light: LinkLight,
  thin: LinkThin,
} as const

export const Link = (props: IconProps) => {
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
