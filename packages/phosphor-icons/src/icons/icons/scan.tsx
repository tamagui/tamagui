import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ScanBold } from '../bold/scan-bold'
import { ScanDuotone } from '../duotone/scan-duotone'
import { ScanFill } from '../fill/scan-fill'
import { ScanLight } from '../light/scan-light'
import { ScanRegular } from '../regular/scan-regular'
import { ScanThin } from '../thin/scan-thin'

const weightMap = {
  regular: ScanRegular,
  bold: ScanBold,
  duotone: ScanDuotone,
  fill: ScanFill,
  light: ScanLight,
  thin: ScanThin,
} as const

export const Scan = (props: IconProps) => {
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
