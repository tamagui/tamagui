import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WarningBold } from '../bold/warning-bold'
import { WarningDuotone } from '../duotone/warning-duotone'
import { WarningFill } from '../fill/warning-fill'
import { WarningLight } from '../light/warning-light'
import { WarningRegular } from '../regular/warning-regular'
import { WarningThin } from '../thin/warning-thin'

const weightMap = {
  regular: WarningRegular,
  bold: WarningBold,
  duotone: WarningDuotone,
  fill: WarningFill,
  light: WarningLight,
  thin: WarningThin,
} as const

export const Warning = (props: IconProps) => {
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
