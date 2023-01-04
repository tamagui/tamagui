import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkSimpleHorizontalBreakBold } from '../bold/link-simple-horizontal-break-bold'
import { LinkSimpleHorizontalBreakDuotone } from '../duotone/link-simple-horizontal-break-duotone'
import { LinkSimpleHorizontalBreakFill } from '../fill/link-simple-horizontal-break-fill'
import { LinkSimpleHorizontalBreakLight } from '../light/link-simple-horizontal-break-light'
import { LinkSimpleHorizontalBreakRegular } from '../regular/link-simple-horizontal-break-regular'
import { LinkSimpleHorizontalBreakThin } from '../thin/link-simple-horizontal-break-thin'

const weightMap = {
  regular: LinkSimpleHorizontalBreakRegular,
  bold: LinkSimpleHorizontalBreakBold,
  duotone: LinkSimpleHorizontalBreakDuotone,
  fill: LinkSimpleHorizontalBreakFill,
  light: LinkSimpleHorizontalBreakLight,
  thin: LinkSimpleHorizontalBreakThin,
} as const

export const LinkSimpleHorizontalBreak = (props: IconProps) => {
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
