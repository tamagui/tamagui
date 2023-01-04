import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkBreakBold } from '../bold/link-break-bold'
import { LinkBreakDuotone } from '../duotone/link-break-duotone'
import { LinkBreakFill } from '../fill/link-break-fill'
import { LinkBreakLight } from '../light/link-break-light'
import { LinkBreakRegular } from '../regular/link-break-regular'
import { LinkBreakThin } from '../thin/link-break-thin'

const weightMap = {
  regular: LinkBreakRegular,
  bold: LinkBreakBold,
  duotone: LinkBreakDuotone,
  fill: LinkBreakFill,
  light: LinkBreakLight,
  thin: LinkBreakThin,
} as const

export const LinkBreak = (props: IconProps) => {
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
