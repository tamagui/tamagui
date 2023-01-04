import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CylinderBold } from '../bold/cylinder-bold'
import { CylinderDuotone } from '../duotone/cylinder-duotone'
import { CylinderFill } from '../fill/cylinder-fill'
import { CylinderLight } from '../light/cylinder-light'
import { CylinderRegular } from '../regular/cylinder-regular'
import { CylinderThin } from '../thin/cylinder-thin'

const weightMap = {
  regular: CylinderRegular,
  bold: CylinderBold,
  duotone: CylinderDuotone,
  fill: CylinderFill,
  light: CylinderLight,
  thin: CylinderThin,
} as const

export const Cylinder = (props: IconProps) => {
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
