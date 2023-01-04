import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberThreeBold } from '../bold/number-three-bold'
import { NumberThreeDuotone } from '../duotone/number-three-duotone'
import { NumberThreeFill } from '../fill/number-three-fill'
import { NumberThreeLight } from '../light/number-three-light'
import { NumberThreeRegular } from '../regular/number-three-regular'
import { NumberThreeThin } from '../thin/number-three-thin'

const weightMap = {
  regular: NumberThreeRegular,
  bold: NumberThreeBold,
  duotone: NumberThreeDuotone,
  fill: NumberThreeFill,
  light: NumberThreeLight,
  thin: NumberThreeThin,
} as const

export const NumberThree = (props: IconProps) => {
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
