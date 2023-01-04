import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EarSlashBold } from '../bold/ear-slash-bold'
import { EarSlashDuotone } from '../duotone/ear-slash-duotone'
import { EarSlashFill } from '../fill/ear-slash-fill'
import { EarSlashLight } from '../light/ear-slash-light'
import { EarSlashRegular } from '../regular/ear-slash-regular'
import { EarSlashThin } from '../thin/ear-slash-thin'

const weightMap = {
  regular: EarSlashRegular,
  bold: EarSlashBold,
  duotone: EarSlashDuotone,
  fill: EarSlashFill,
  light: EarSlashLight,
  thin: EarSlashThin,
} as const

export const EarSlash = (props: IconProps) => {
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
