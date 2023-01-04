import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HashStraightBold } from '../bold/hash-straight-bold'
import { HashStraightDuotone } from '../duotone/hash-straight-duotone'
import { HashStraightFill } from '../fill/hash-straight-fill'
import { HashStraightLight } from '../light/hash-straight-light'
import { HashStraightRegular } from '../regular/hash-straight-regular'
import { HashStraightThin } from '../thin/hash-straight-thin'

const weightMap = {
  regular: HashStraightRegular,
  bold: HashStraightBold,
  duotone: HashStraightDuotone,
  fill: HashStraightFill,
  light: HashStraightLight,
  thin: HashStraightThin,
} as const

export const HashStraight = (props: IconProps) => {
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
