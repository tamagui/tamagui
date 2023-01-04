import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PillBold } from '../bold/pill-bold'
import { PillDuotone } from '../duotone/pill-duotone'
import { PillFill } from '../fill/pill-fill'
import { PillLight } from '../light/pill-light'
import { PillRegular } from '../regular/pill-regular'
import { PillThin } from '../thin/pill-thin'

const weightMap = {
  regular: PillRegular,
  bold: PillBold,
  duotone: PillDuotone,
  fill: PillFill,
  light: PillLight,
  thin: PillThin,
} as const

export const Pill = (props: IconProps) => {
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
