import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpinnerGapBold } from '../bold/spinner-gap-bold'
import { SpinnerGapDuotone } from '../duotone/spinner-gap-duotone'
import { SpinnerGapFill } from '../fill/spinner-gap-fill'
import { SpinnerGapLight } from '../light/spinner-gap-light'
import { SpinnerGapRegular } from '../regular/spinner-gap-regular'
import { SpinnerGapThin } from '../thin/spinner-gap-thin'

const weightMap = {
  regular: SpinnerGapRegular,
  bold: SpinnerGapBold,
  duotone: SpinnerGapDuotone,
  fill: SpinnerGapFill,
  light: SpinnerGapLight,
  thin: SpinnerGapThin,
} as const

export const SpinnerGap = (props: IconProps) => {
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
