import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AnchorBold } from '../bold/anchor-bold'
import { AnchorDuotone } from '../duotone/anchor-duotone'
import { AnchorFill } from '../fill/anchor-fill'
import { AnchorLight } from '../light/anchor-light'
import { AnchorRegular } from '../regular/anchor-regular'
import { AnchorThin } from '../thin/anchor-thin'

const weightMap = {
  regular: AnchorRegular,
  bold: AnchorBold,
  duotone: AnchorDuotone,
  fill: AnchorFill,
  light: AnchorLight,
  thin: AnchorThin,
} as const

export const Anchor = (props: IconProps) => {
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
