import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PrescriptionBold } from '../bold/prescription-bold'
import { PrescriptionDuotone } from '../duotone/prescription-duotone'
import { PrescriptionFill } from '../fill/prescription-fill'
import { PrescriptionLight } from '../light/prescription-light'
import { PrescriptionRegular } from '../regular/prescription-regular'
import { PrescriptionThin } from '../thin/prescription-thin'

const weightMap = {
  regular: PrescriptionRegular,
  bold: PrescriptionBold,
  duotone: PrescriptionDuotone,
  fill: PrescriptionFill,
  light: PrescriptionLight,
  thin: PrescriptionThin,
} as const

export const Prescription = (props: IconProps) => {
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
