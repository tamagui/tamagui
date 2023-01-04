import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileCssBold } from '../bold/file-css-bold'
import { FileCssDuotone } from '../duotone/file-css-duotone'
import { FileCssFill } from '../fill/file-css-fill'
import { FileCssLight } from '../light/file-css-light'
import { FileCssRegular } from '../regular/file-css-regular'
import { FileCssThin } from '../thin/file-css-thin'

const weightMap = {
  regular: FileCssRegular,
  bold: FileCssBold,
  duotone: FileCssDuotone,
  fill: FileCssFill,
  light: FileCssLight,
  thin: FileCssThin,
} as const

export const FileCss = (props: IconProps) => {
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
