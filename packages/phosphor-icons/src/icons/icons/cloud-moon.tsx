import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudMoonBold } from '../bold/cloud-moon-bold'
import { CloudMoonDuotone } from '../duotone/cloud-moon-duotone'
import { CloudMoonFill } from '../fill/cloud-moon-fill'
import { CloudMoonLight } from '../light/cloud-moon-light'
import { CloudMoonRegular } from '../regular/cloud-moon-regular'
import { CloudMoonThin } from '../thin/cloud-moon-thin'

const weightMap = {
  regular: CloudMoonRegular,
  bold: CloudMoonBold,
  duotone: CloudMoonDuotone,
  fill: CloudMoonFill,
  light: CloudMoonLight,
  thin: CloudMoonThin,
} as const

export const CloudMoon = (props: IconProps) => {
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
