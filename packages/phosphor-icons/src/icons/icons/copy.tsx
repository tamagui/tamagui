import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CopyBold } from '../bold/copy-bold'
import { CopyDuotone } from '../duotone/copy-duotone'
import { CopyFill } from '../fill/copy-fill'
import { CopyLight } from '../light/copy-light'
import { CopyRegular } from '../regular/copy-regular'
import { CopyThin } from '../thin/copy-thin'

const weightMap = {
  regular: CopyRegular,
  bold: CopyBold,
  duotone: CopyDuotone,
  fill: CopyFill,
  light: CopyLight,
  thin: CopyThin,
} as const

export const Copy = (props: IconProps) => {
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
