import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BirdBold } from '../bold/bird-bold'
import { BirdDuotone } from '../duotone/bird-duotone'
import { BirdFill } from '../fill/bird-fill'
import { BirdLight } from '../light/bird-light'
import { BirdRegular } from '../regular/bird-regular'
import { BirdThin } from '../thin/bird-thin'

const weightMap = {
  regular: BirdRegular,
  bold: BirdBold,
  duotone: BirdDuotone,
  fill: BirdFill,
  light: BirdLight,
  thin: BirdThin,
} as const

export const Bird = (props: IconProps) => {
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
