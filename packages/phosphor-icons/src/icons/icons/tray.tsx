import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrayBold } from '../bold/tray-bold'
import { TrayDuotone } from '../duotone/tray-duotone'
import { TrayFill } from '../fill/tray-fill'
import { TrayLight } from '../light/tray-light'
import { TrayRegular } from '../regular/tray-regular'
import { TrayThin } from '../thin/tray-thin'

const weightMap = {
  regular: TrayRegular,
  bold: TrayBold,
  duotone: TrayDuotone,
  fill: TrayFill,
  light: TrayLight,
  thin: TrayThin,
} as const

export const Tray = (props: IconProps) => {
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
