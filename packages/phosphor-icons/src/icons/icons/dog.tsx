import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DogBold } from '../bold/dog-bold'
import { DogDuotone } from '../duotone/dog-duotone'
import { DogFill } from '../fill/dog-fill'
import { DogLight } from '../light/dog-light'
import { DogRegular } from '../regular/dog-regular'
import { DogThin } from '../thin/dog-thin'

const weightMap = {
  regular: DogRegular,
  bold: DogBold,
  duotone: DogDuotone,
  fill: DogFill,
  light: DogLight,
  thin: DogThin,
} as const

export const Dog = (props: IconProps) => {
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
