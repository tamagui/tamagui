import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudBold } from '../bold/cloud-bold'
import { CloudDuotone } from '../duotone/cloud-duotone'
import { CloudFill } from '../fill/cloud-fill'
import { CloudLight } from '../light/cloud-light'
import { CloudRegular } from '../regular/cloud-regular'
import { CloudThin } from '../thin/cloud-thin'

const weightMap = {
  regular: CloudRegular,
  bold: CloudBold,
  duotone: CloudDuotone,
  fill: CloudFill,
  light: CloudLight,
  thin: CloudThin,
} as const

export const Cloud = (props: IconProps) => {
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
