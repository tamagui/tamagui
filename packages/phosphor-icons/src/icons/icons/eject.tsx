import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EjectBold } from '../bold/eject-bold'
import { EjectDuotone } from '../duotone/eject-duotone'
import { EjectFill } from '../fill/eject-fill'
import { EjectLight } from '../light/eject-light'
import { EjectRegular } from '../regular/eject-regular'
import { EjectThin } from '../thin/eject-thin'

const weightMap = {
  regular: EjectRegular,
  bold: EjectBold,
  duotone: EjectDuotone,
  fill: EjectFill,
  light: EjectLight,
  thin: EjectThin,
} as const

export const Eject = (props: IconProps) => {
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
