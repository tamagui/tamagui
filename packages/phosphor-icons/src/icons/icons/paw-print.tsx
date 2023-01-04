import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PawPrintBold } from '../bold/paw-print-bold'
import { PawPrintDuotone } from '../duotone/paw-print-duotone'
import { PawPrintFill } from '../fill/paw-print-fill'
import { PawPrintLight } from '../light/paw-print-light'
import { PawPrintRegular } from '../regular/paw-print-regular'
import { PawPrintThin } from '../thin/paw-print-thin'

const weightMap = {
  regular: PawPrintRegular,
  bold: PawPrintBold,
  duotone: PawPrintDuotone,
  fill: PawPrintFill,
  light: PawPrintLight,
  thin: PawPrintThin,
} as const

export const PawPrint = (props: IconProps) => {
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
