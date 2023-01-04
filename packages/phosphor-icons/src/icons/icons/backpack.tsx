import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BackpackBold } from '../bold/backpack-bold'
import { BackpackDuotone } from '../duotone/backpack-duotone'
import { BackpackFill } from '../fill/backpack-fill'
import { BackpackLight } from '../light/backpack-light'
import { BackpackRegular } from '../regular/backpack-regular'
import { BackpackThin } from '../thin/backpack-thin'

const weightMap = {
  regular: BackpackRegular,
  bold: BackpackBold,
  duotone: BackpackDuotone,
  fill: BackpackFill,
  light: BackpackLight,
  thin: BackpackThin,
} as const

export const Backpack = (props: IconProps) => {
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
