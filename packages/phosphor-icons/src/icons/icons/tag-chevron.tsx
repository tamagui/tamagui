import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TagChevronBold } from '../bold/tag-chevron-bold'
import { TagChevronDuotone } from '../duotone/tag-chevron-duotone'
import { TagChevronFill } from '../fill/tag-chevron-fill'
import { TagChevronLight } from '../light/tag-chevron-light'
import { TagChevronRegular } from '../regular/tag-chevron-regular'
import { TagChevronThin } from '../thin/tag-chevron-thin'

const weightMap = {
  regular: TagChevronRegular,
  bold: TagChevronBold,
  duotone: TagChevronDuotone,
  fill: TagChevronFill,
  light: TagChevronLight,
  thin: TagChevronThin,
} as const

export const TagChevron = (props: IconProps) => {
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
