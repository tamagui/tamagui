import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VignetteBold } from '../bold/vignette-bold'
import { VignetteDuotone } from '../duotone/vignette-duotone'
import { VignetteFill } from '../fill/vignette-fill'
import { VignetteLight } from '../light/vignette-light'
import { VignetteRegular } from '../regular/vignette-regular'
import { VignetteThin } from '../thin/vignette-thin'

const weightMap = {
  regular: VignetteRegular,
  bold: VignetteBold,
  duotone: VignetteDuotone,
  fill: VignetteFill,
  light: VignetteLight,
  thin: VignetteThin,
} as const

export const Vignette = (props: IconProps) => {
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
