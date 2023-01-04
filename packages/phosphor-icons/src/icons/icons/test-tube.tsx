import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TestTubeBold } from '../bold/test-tube-bold'
import { TestTubeDuotone } from '../duotone/test-tube-duotone'
import { TestTubeFill } from '../fill/test-tube-fill'
import { TestTubeLight } from '../light/test-tube-light'
import { TestTubeRegular } from '../regular/test-tube-regular'
import { TestTubeThin } from '../thin/test-tube-thin'

const weightMap = {
  regular: TestTubeRegular,
  bold: TestTubeBold,
  duotone: TestTubeDuotone,
  fill: TestTubeFill,
  light: TestTubeLight,
  thin: TestTubeThin,
} as const

export const TestTube = (props: IconProps) => {
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
