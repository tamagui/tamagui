import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RugBold } from '../bold/rug-bold'
import { RugDuotone } from '../duotone/rug-duotone'
import { RugFill } from '../fill/rug-fill'
import { RugLight } from '../light/rug-light'
import { RugRegular } from '../regular/rug-regular'
import { RugThin } from '../thin/rug-thin'

const weightMap = {
  regular: RugRegular,
  bold: RugBold,
  duotone: RugDuotone,
  fill: RugFill,
  light: RugLight,
  thin: RugThin,
} as const

export const Rug = (props: IconProps) => {
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
