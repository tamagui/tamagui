import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BagBold } from '../bold/bag-bold'
import { BagDuotone } from '../duotone/bag-duotone'
import { BagFill } from '../fill/bag-fill'
import { BagLight } from '../light/bag-light'
import { BagRegular } from '../regular/bag-regular'
import { BagThin } from '../thin/bag-thin'

const weightMap = {
  regular: BagRegular,
  bold: BagBold,
  duotone: BagDuotone,
  fill: BagFill,
  light: BagLight,
  thin: BagThin,
} as const

export const Bag = (props: IconProps) => {
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
