import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GameControllerBold } from '../bold/game-controller-bold'
import { GameControllerDuotone } from '../duotone/game-controller-duotone'
import { GameControllerFill } from '../fill/game-controller-fill'
import { GameControllerLight } from '../light/game-controller-light'
import { GameControllerRegular } from '../regular/game-controller-regular'
import { GameControllerThin } from '../thin/game-controller-thin'

const weightMap = {
  regular: GameControllerRegular,
  bold: GameControllerBold,
  duotone: GameControllerDuotone,
  fill: GameControllerFill,
  light: GameControllerLight,
  thin: GameControllerThin,
} as const

export const GameController = (props: IconProps) => {
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
