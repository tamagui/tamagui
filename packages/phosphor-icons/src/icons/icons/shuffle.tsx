import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShuffleBold } from '../bold/shuffle-bold'
import { ShuffleDuotone } from '../duotone/shuffle-duotone'
import { ShuffleFill } from '../fill/shuffle-fill'
import { ShuffleLight } from '../light/shuffle-light'
import { ShuffleRegular } from '../regular/shuffle-regular'
import { ShuffleThin } from '../thin/shuffle-thin'

const weightMap = {
  regular: ShuffleRegular,
  bold: ShuffleBold,
  duotone: ShuffleDuotone,
  fill: ShuffleFill,
  light: ShuffleLight,
  thin: ShuffleThin,
} as const

export const Shuffle = (props: IconProps) => {
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
