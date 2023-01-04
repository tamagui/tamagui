import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SyringeBold } from '../bold/syringe-bold'
import { SyringeDuotone } from '../duotone/syringe-duotone'
import { SyringeFill } from '../fill/syringe-fill'
import { SyringeLight } from '../light/syringe-light'
import { SyringeRegular } from '../regular/syringe-regular'
import { SyringeThin } from '../thin/syringe-thin'

const weightMap = {
  regular: SyringeRegular,
  bold: SyringeBold,
  duotone: SyringeDuotone,
  fill: SyringeFill,
  light: SyringeLight,
  thin: SyringeThin,
} as const

export const Syringe = (props: IconProps) => {
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
