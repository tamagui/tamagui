import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberNineBold } from '../bold/number-nine-bold'
import { NumberNineDuotone } from '../duotone/number-nine-duotone'
import { NumberNineFill } from '../fill/number-nine-fill'
import { NumberNineLight } from '../light/number-nine-light'
import { NumberNineRegular } from '../regular/number-nine-regular'
import { NumberNineThin } from '../thin/number-nine-thin'

const weightMap = {
  regular: NumberNineRegular,
  bold: NumberNineBold,
  duotone: NumberNineDuotone,
  fill: NumberNineFill,
  light: NumberNineLight,
  thin: NumberNineThin,
} as const

export const NumberNine = (props: IconProps) => {
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
