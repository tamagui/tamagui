import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignRightBold } from '../bold/align-right-bold'
import { AlignRightDuotone } from '../duotone/align-right-duotone'
import { AlignRightFill } from '../fill/align-right-fill'
import { AlignRightLight } from '../light/align-right-light'
import { AlignRightRegular } from '../regular/align-right-regular'
import { AlignRightThin } from '../thin/align-right-thin'

const weightMap = {
  regular: AlignRightRegular,
  bold: AlignRightBold,
  duotone: AlignRightDuotone,
  fill: AlignRightFill,
  light: AlignRightLight,
  thin: AlignRightThin,
} as const

export const AlignRight = (props: IconProps) => {
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
