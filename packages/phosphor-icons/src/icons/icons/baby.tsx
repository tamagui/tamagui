import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BabyBold } from '../bold/baby-bold'
import { BabyDuotone } from '../duotone/baby-duotone'
import { BabyFill } from '../fill/baby-fill'
import { BabyLight } from '../light/baby-light'
import { BabyRegular } from '../regular/baby-regular'
import { BabyThin } from '../thin/baby-thin'

const weightMap = {
  regular: BabyRegular,
  bold: BabyBold,
  duotone: BabyDuotone,
  fill: BabyFill,
  light: BabyLight,
  thin: BabyThin,
} as const

export const Baby = (props: IconProps) => {
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
