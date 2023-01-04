import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextOutdentBold } from '../bold/text-outdent-bold'
import { TextOutdentDuotone } from '../duotone/text-outdent-duotone'
import { TextOutdentFill } from '../fill/text-outdent-fill'
import { TextOutdentLight } from '../light/text-outdent-light'
import { TextOutdentRegular } from '../regular/text-outdent-regular'
import { TextOutdentThin } from '../thin/text-outdent-thin'

const weightMap = {
  regular: TextOutdentRegular,
  bold: TextOutdentBold,
  duotone: TextOutdentDuotone,
  fill: TextOutdentFill,
  light: TextOutdentLight,
  thin: TextOutdentThin,
} as const

export const TextOutdent = (props: IconProps) => {
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
