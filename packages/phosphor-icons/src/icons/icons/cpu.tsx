import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CpuBold } from '../bold/cpu-bold'
import { CpuDuotone } from '../duotone/cpu-duotone'
import { CpuFill } from '../fill/cpu-fill'
import { CpuLight } from '../light/cpu-light'
import { CpuRegular } from '../regular/cpu-regular'
import { CpuThin } from '../thin/cpu-thin'

const weightMap = {
  regular: CpuRegular,
  bold: CpuBold,
  duotone: CpuDuotone,
  fill: CpuFill,
  light: CpuLight,
  thin: CpuThin,
} as const

export const Cpu = (props: IconProps) => {
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
