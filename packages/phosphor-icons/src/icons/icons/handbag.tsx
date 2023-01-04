import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandbagBold } from '../bold/handbag-bold'
import { HandbagDuotone } from '../duotone/handbag-duotone'
import { HandbagFill } from '../fill/handbag-fill'
import { HandbagLight } from '../light/handbag-light'
import { HandbagRegular } from '../regular/handbag-regular'
import { HandbagThin } from '../thin/handbag-thin'

const weightMap = {
  regular: HandbagRegular,
  bold: HandbagBold,
  duotone: HandbagDuotone,
  fill: HandbagFill,
  light: HandbagLight,
  thin: HandbagThin,
} as const

export const Handbag = (props: IconProps) => {
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
