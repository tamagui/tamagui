import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldChevronBold } from '../bold/shield-chevron-bold'
import { ShieldChevronDuotone } from '../duotone/shield-chevron-duotone'
import { ShieldChevronFill } from '../fill/shield-chevron-fill'
import { ShieldChevronLight } from '../light/shield-chevron-light'
import { ShieldChevronRegular } from '../regular/shield-chevron-regular'
import { ShieldChevronThin } from '../thin/shield-chevron-thin'

const weightMap = {
  regular: ShieldChevronRegular,
  bold: ShieldChevronBold,
  duotone: ShieldChevronDuotone,
  fill: ShieldChevronFill,
  light: ShieldChevronLight,
  thin: ShieldChevronThin,
} as const

export const ShieldChevron = (props: IconProps) => {
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
