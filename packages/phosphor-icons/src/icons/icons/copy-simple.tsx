import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CopySimpleBold } from '../bold/copy-simple-bold'
import { CopySimpleDuotone } from '../duotone/copy-simple-duotone'
import { CopySimpleFill } from '../fill/copy-simple-fill'
import { CopySimpleLight } from '../light/copy-simple-light'
import { CopySimpleRegular } from '../regular/copy-simple-regular'
import { CopySimpleThin } from '../thin/copy-simple-thin'

const weightMap = {
  regular: CopySimpleRegular,
  bold: CopySimpleBold,
  duotone: CopySimpleDuotone,
  fill: CopySimpleFill,
  light: CopySimpleLight,
  thin: CopySimpleThin,
} as const

export const CopySimple = (props: IconProps) => {
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
