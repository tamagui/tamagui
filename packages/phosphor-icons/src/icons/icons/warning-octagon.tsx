import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WarningOctagonBold } from '../bold/warning-octagon-bold'
import { WarningOctagonDuotone } from '../duotone/warning-octagon-duotone'
import { WarningOctagonFill } from '../fill/warning-octagon-fill'
import { WarningOctagonLight } from '../light/warning-octagon-light'
import { WarningOctagonRegular } from '../regular/warning-octagon-regular'
import { WarningOctagonThin } from '../thin/warning-octagon-thin'

const weightMap = {
  regular: WarningOctagonRegular,
  bold: WarningOctagonBold,
  duotone: WarningOctagonDuotone,
  fill: WarningOctagonFill,
  light: WarningOctagonLight,
  thin: WarningOctagonThin,
} as const

export const WarningOctagon = (props: IconProps) => {
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
