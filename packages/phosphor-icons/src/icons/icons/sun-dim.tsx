import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SunDimBold } from '../bold/sun-dim-bold'
import { SunDimDuotone } from '../duotone/sun-dim-duotone'
import { SunDimFill } from '../fill/sun-dim-fill'
import { SunDimLight } from '../light/sun-dim-light'
import { SunDimRegular } from '../regular/sun-dim-regular'
import { SunDimThin } from '../thin/sun-dim-thin'

const weightMap = {
  regular: SunDimRegular,
  bold: SunDimBold,
  duotone: SunDimDuotone,
  fill: SunDimFill,
  light: SunDimLight,
  thin: SunDimThin,
} as const

export const SunDim = (props: IconProps) => {
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
