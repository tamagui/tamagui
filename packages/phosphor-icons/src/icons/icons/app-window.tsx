import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AppWindowBold } from '../bold/app-window-bold'
import { AppWindowDuotone } from '../duotone/app-window-duotone'
import { AppWindowFill } from '../fill/app-window-fill'
import { AppWindowLight } from '../light/app-window-light'
import { AppWindowRegular } from '../regular/app-window-regular'
import { AppWindowThin } from '../thin/app-window-thin'

const weightMap = {
  regular: AppWindowRegular,
  bold: AppWindowBold,
  duotone: AppWindowDuotone,
  fill: AppWindowFill,
  light: AppWindowLight,
  thin: AppWindowThin,
} as const

export const AppWindow = (props: IconProps) => {
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
