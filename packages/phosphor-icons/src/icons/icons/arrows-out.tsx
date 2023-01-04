import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsOutBold } from '../bold/arrows-out-bold'
import { ArrowsOutDuotone } from '../duotone/arrows-out-duotone'
import { ArrowsOutFill } from '../fill/arrows-out-fill'
import { ArrowsOutLight } from '../light/arrows-out-light'
import { ArrowsOutRegular } from '../regular/arrows-out-regular'
import { ArrowsOutThin } from '../thin/arrows-out-thin'

const weightMap = {
  regular: ArrowsOutRegular,
  bold: ArrowsOutBold,
  duotone: ArrowsOutDuotone,
  fill: ArrowsOutFill,
  light: ArrowsOutLight,
  thin: ArrowsOutThin,
} as const

export const ArrowsOut = (props: IconProps) => {
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
