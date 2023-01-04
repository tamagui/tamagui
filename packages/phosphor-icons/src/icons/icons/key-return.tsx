import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { KeyReturnBold } from '../bold/key-return-bold'
import { KeyReturnDuotone } from '../duotone/key-return-duotone'
import { KeyReturnFill } from '../fill/key-return-fill'
import { KeyReturnLight } from '../light/key-return-light'
import { KeyReturnRegular } from '../regular/key-return-regular'
import { KeyReturnThin } from '../thin/key-return-thin'

const weightMap = {
  regular: KeyReturnRegular,
  bold: KeyReturnBold,
  duotone: KeyReturnDuotone,
  fill: KeyReturnFill,
  light: KeyReturnLight,
  thin: KeyReturnThin,
} as const

export const KeyReturn = (props: IconProps) => {
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
