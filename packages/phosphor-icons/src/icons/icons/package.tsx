import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PackageBold } from '../bold/package-bold'
import { PackageDuotone } from '../duotone/package-duotone'
import { PackageFill } from '../fill/package-fill'
import { PackageLight } from '../light/package-light'
import { PackageRegular } from '../regular/package-regular'
import { PackageThin } from '../thin/package-thin'

const weightMap = {
  regular: PackageRegular,
  bold: PackageBold,
  duotone: PackageDuotone,
  fill: PackageFill,
  light: PackageLight,
  thin: PackageThin,
} as const

export const Package = (props: IconProps) => {
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
