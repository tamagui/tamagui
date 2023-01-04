import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WrenchBold } from '../bold/wrench-bold'
import { WrenchDuotone } from '../duotone/wrench-duotone'
import { WrenchFill } from '../fill/wrench-fill'
import { WrenchLight } from '../light/wrench-light'
import { WrenchRegular } from '../regular/wrench-regular'
import { WrenchThin } from '../thin/wrench-thin'

const weightMap = {
  regular: WrenchRegular,
  bold: WrenchBold,
  duotone: WrenchDuotone,
  fill: WrenchFill,
  light: WrenchLight,
  thin: WrenchThin,
} as const

export const Wrench = (props: IconProps) => {
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
