import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudCheckBold } from '../bold/cloud-check-bold'
import { CloudCheckDuotone } from '../duotone/cloud-check-duotone'
import { CloudCheckFill } from '../fill/cloud-check-fill'
import { CloudCheckLight } from '../light/cloud-check-light'
import { CloudCheckRegular } from '../regular/cloud-check-regular'
import { CloudCheckThin } from '../thin/cloud-check-thin'

const weightMap = {
  regular: CloudCheckRegular,
  bold: CloudCheckBold,
  duotone: CloudCheckDuotone,
  fill: CloudCheckFill,
  light: CloudCheckLight,
  thin: CloudCheckThin,
} as const

export const CloudCheck = (props: IconProps) => {
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
