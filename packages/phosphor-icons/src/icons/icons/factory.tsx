import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FactoryBold } from '../bold/factory-bold'
import { FactoryDuotone } from '../duotone/factory-duotone'
import { FactoryFill } from '../fill/factory-fill'
import { FactoryLight } from '../light/factory-light'
import { FactoryRegular } from '../regular/factory-regular'
import { FactoryThin } from '../thin/factory-thin'

const weightMap = {
  regular: FactoryRegular,
  bold: FactoryBold,
  duotone: FactoryDuotone,
  fill: FactoryFill,
  light: FactoryLight,
  thin: FactoryThin,
} as const

export const Factory = (props: IconProps) => {
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
