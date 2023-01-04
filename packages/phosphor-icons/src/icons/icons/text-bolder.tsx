import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextBolderBold } from '../bold/text-bolder-bold'
import { TextBolderDuotone } from '../duotone/text-bolder-duotone'
import { TextBolderFill } from '../fill/text-bolder-fill'
import { TextBolderLight } from '../light/text-bolder-light'
import { TextBolderRegular } from '../regular/text-bolder-regular'
import { TextBolderThin } from '../thin/text-bolder-thin'

const weightMap = {
  regular: TextBolderRegular,
  bold: TextBolderBold,
  duotone: TextBolderDuotone,
  fill: TextBolderFill,
  light: TextBolderLight,
  thin: TextBolderThin,
} as const

export const TextBolder = (props: IconProps) => {
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
