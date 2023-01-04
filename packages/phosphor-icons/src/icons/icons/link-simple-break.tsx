import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkSimpleBreakBold } from '../bold/link-simple-break-bold'
import { LinkSimpleBreakDuotone } from '../duotone/link-simple-break-duotone'
import { LinkSimpleBreakFill } from '../fill/link-simple-break-fill'
import { LinkSimpleBreakLight } from '../light/link-simple-break-light'
import { LinkSimpleBreakRegular } from '../regular/link-simple-break-regular'
import { LinkSimpleBreakThin } from '../thin/link-simple-break-thin'

const weightMap = {
  regular: LinkSimpleBreakRegular,
  bold: LinkSimpleBreakBold,
  duotone: LinkSimpleBreakDuotone,
  fill: LinkSimpleBreakFill,
  light: LinkSimpleBreakLight,
  thin: LinkSimpleBreakThin,
} as const

export const LinkSimpleBreak = (props: IconProps) => {
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
