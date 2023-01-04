import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FootballBold } from '../bold/football-bold'
import { FootballDuotone } from '../duotone/football-duotone'
import { FootballFill } from '../fill/football-fill'
import { FootballLight } from '../light/football-light'
import { FootballRegular } from '../regular/football-regular'
import { FootballThin } from '../thin/football-thin'

const weightMap = {
  regular: FootballRegular,
  bold: FootballBold,
  duotone: FootballDuotone,
  fill: FootballFill,
  light: FootballLight,
  thin: FootballThin,
} as const

export const Football = (props: IconProps) => {
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
