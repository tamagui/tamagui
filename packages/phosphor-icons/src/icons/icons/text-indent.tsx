import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextIndentBold } from '../bold/text-indent-bold'
import { TextIndentDuotone } from '../duotone/text-indent-duotone'
import { TextIndentFill } from '../fill/text-indent-fill'
import { TextIndentLight } from '../light/text-indent-light'
import { TextIndentRegular } from '../regular/text-indent-regular'
import { TextIndentThin } from '../thin/text-indent-thin'

const weightMap = {
  regular: TextIndentRegular,
  bold: TextIndentBold,
  duotone: TextIndentDuotone,
  fill: TextIndentFill,
  light: TextIndentLight,
  thin: TextIndentThin,
} as const

export const TextIndent = (props: IconProps) => {
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
