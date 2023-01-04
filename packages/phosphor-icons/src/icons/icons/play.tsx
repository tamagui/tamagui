import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlayBold } from '../bold/play-bold'
import { PlayDuotone } from '../duotone/play-duotone'
import { PlayFill } from '../fill/play-fill'
import { PlayLight } from '../light/play-light'
import { PlayRegular } from '../regular/play-regular'
import { PlayThin } from '../thin/play-thin'

const weightMap = {
  regular: PlayRegular,
  bold: PlayBold,
  duotone: PlayDuotone,
  fill: PlayFill,
  light: PlayLight,
  thin: PlayThin,
} as const

export const Play = (props: IconProps) => {
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
