import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkSimpleHorizontalBold } from '../bold/link-simple-horizontal-bold'
import { LinkSimpleHorizontalDuotone } from '../duotone/link-simple-horizontal-duotone'
import { LinkSimpleHorizontalFill } from '../fill/link-simple-horizontal-fill'
import { LinkSimpleHorizontalLight } from '../light/link-simple-horizontal-light'
import { LinkSimpleHorizontalRegular } from '../regular/link-simple-horizontal-regular'
import { LinkSimpleHorizontalThin } from '../thin/link-simple-horizontal-thin'

const weightMap = {
  regular: LinkSimpleHorizontalRegular,
  bold: LinkSimpleHorizontalBold,
  duotone: LinkSimpleHorizontalDuotone,
  fill: LinkSimpleHorizontalFill,
  light: LinkSimpleHorizontalLight,
  thin: LinkSimpleHorizontalThin,
} as const

export const LinkSimpleHorizontal = (props: IconProps) => {
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
