import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsNineBold } from '../bold/dots-nine-bold'
import { DotsNineDuotone } from '../duotone/dots-nine-duotone'
import { DotsNineFill } from '../fill/dots-nine-fill'
import { DotsNineLight } from '../light/dots-nine-light'
import { DotsNineRegular } from '../regular/dots-nine-regular'
import { DotsNineThin } from '../thin/dots-nine-thin'

const weightMap = {
  regular: DotsNineRegular,
  bold: DotsNineBold,
  duotone: DotsNineDuotone,
  fill: DotsNineFill,
  light: DotsNineLight,
  thin: DotsNineThin,
} as const

export const DotsNine = (props: IconProps) => {
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
