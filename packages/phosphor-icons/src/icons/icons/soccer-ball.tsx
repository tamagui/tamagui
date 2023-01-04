import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SoccerBallBold } from '../bold/soccer-ball-bold'
import { SoccerBallDuotone } from '../duotone/soccer-ball-duotone'
import { SoccerBallFill } from '../fill/soccer-ball-fill'
import { SoccerBallLight } from '../light/soccer-ball-light'
import { SoccerBallRegular } from '../regular/soccer-ball-regular'
import { SoccerBallThin } from '../thin/soccer-ball-thin'

const weightMap = {
  regular: SoccerBallRegular,
  bold: SoccerBallBold,
  duotone: SoccerBallDuotone,
  fill: SoccerBallFill,
  light: SoccerBallLight,
  thin: SoccerBallThin,
} as const

export const SoccerBall = (props: IconProps) => {
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
