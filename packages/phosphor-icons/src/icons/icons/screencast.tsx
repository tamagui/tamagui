import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ScreencastBold } from '../bold/screencast-bold'
import { ScreencastDuotone } from '../duotone/screencast-duotone'
import { ScreencastFill } from '../fill/screencast-fill'
import { ScreencastLight } from '../light/screencast-light'
import { ScreencastRegular } from '../regular/screencast-regular'
import { ScreencastThin } from '../thin/screencast-thin'

const weightMap = {
  regular: ScreencastRegular,
  bold: ScreencastBold,
  duotone: ScreencastDuotone,
  fill: ScreencastFill,
  light: ScreencastLight,
  thin: ScreencastThin,
} as const

export const Screencast = (props: IconProps) => {
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
