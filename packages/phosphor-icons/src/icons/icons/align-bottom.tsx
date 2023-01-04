import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignBottomBold } from '../bold/align-bottom-bold'
import { AlignBottomDuotone } from '../duotone/align-bottom-duotone'
import { AlignBottomFill } from '../fill/align-bottom-fill'
import { AlignBottomLight } from '../light/align-bottom-light'
import { AlignBottomRegular } from '../regular/align-bottom-regular'
import { AlignBottomThin } from '../thin/align-bottom-thin'

const weightMap = {
  regular: AlignBottomRegular,
  bold: AlignBottomBold,
  duotone: AlignBottomDuotone,
  fill: AlignBottomFill,
  light: AlignBottomLight,
  thin: AlignBottomThin,
} as const

export const AlignBottom = (props: IconProps) => {
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
