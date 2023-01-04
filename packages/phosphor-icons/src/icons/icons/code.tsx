import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CodeBold } from '../bold/code-bold'
import { CodeDuotone } from '../duotone/code-duotone'
import { CodeFill } from '../fill/code-fill'
import { CodeLight } from '../light/code-light'
import { CodeRegular } from '../regular/code-regular'
import { CodeThin } from '../thin/code-thin'

const weightMap = {
  regular: CodeRegular,
  bold: CodeBold,
  duotone: CodeDuotone,
  fill: CodeFill,
  light: CodeLight,
  thin: CodeThin,
} as const

export const Code = (props: IconProps) => {
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
