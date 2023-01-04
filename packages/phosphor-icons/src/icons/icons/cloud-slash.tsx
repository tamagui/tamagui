import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudSlashBold } from '../bold/cloud-slash-bold'
import { CloudSlashDuotone } from '../duotone/cloud-slash-duotone'
import { CloudSlashFill } from '../fill/cloud-slash-fill'
import { CloudSlashLight } from '../light/cloud-slash-light'
import { CloudSlashRegular } from '../regular/cloud-slash-regular'
import { CloudSlashThin } from '../thin/cloud-slash-thin'

const weightMap = {
  regular: CloudSlashRegular,
  bold: CloudSlashBold,
  duotone: CloudSlashDuotone,
  fill: CloudSlashFill,
  light: CloudSlashLight,
  thin: CloudSlashThin,
} as const

export const CloudSlash = (props: IconProps) => {
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
