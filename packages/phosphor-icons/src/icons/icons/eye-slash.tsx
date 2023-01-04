import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EyeSlashBold } from '../bold/eye-slash-bold'
import { EyeSlashDuotone } from '../duotone/eye-slash-duotone'
import { EyeSlashFill } from '../fill/eye-slash-fill'
import { EyeSlashLight } from '../light/eye-slash-light'
import { EyeSlashRegular } from '../regular/eye-slash-regular'
import { EyeSlashThin } from '../thin/eye-slash-thin'

const weightMap = {
  regular: EyeSlashRegular,
  bold: EyeSlashBold,
  duotone: EyeSlashDuotone,
  fill: EyeSlashFill,
  light: EyeSlashLight,
  thin: EyeSlashThin,
} as const

export const EyeSlash = (props: IconProps) => {
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
