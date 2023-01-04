import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrophyBold } from '../bold/trophy-bold'
import { TrophyDuotone } from '../duotone/trophy-duotone'
import { TrophyFill } from '../fill/trophy-fill'
import { TrophyLight } from '../light/trophy-light'
import { TrophyRegular } from '../regular/trophy-regular'
import { TrophyThin } from '../thin/trophy-thin'

const weightMap = {
  regular: TrophyRegular,
  bold: TrophyBold,
  duotone: TrophyDuotone,
  fill: TrophyFill,
  light: TrophyLight,
  thin: TrophyThin,
} as const

export const Trophy = (props: IconProps) => {
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
