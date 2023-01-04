import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { KeyBold } from '../bold/key-bold'
import { KeyDuotone } from '../duotone/key-duotone'
import { KeyFill } from '../fill/key-fill'
import { KeyLight } from '../light/key-light'
import { KeyRegular } from '../regular/key-regular'
import { KeyThin } from '../thin/key-thin'

const weightMap = {
  regular: KeyRegular,
  bold: KeyBold,
  duotone: KeyDuotone,
  fill: KeyFill,
  light: KeyLight,
  thin: KeyThin,
} as const

export const Key = (props: IconProps) => {
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
