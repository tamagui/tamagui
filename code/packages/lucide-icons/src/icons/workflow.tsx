import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Rect width="8" height="8" x="3" y="3" rx="2" stroke={color} />
      <Path d="M7 11v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Rect width="8" height="8" x="13" y="13" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Workflow'

export const Workflow = memo<IconProps>(themed(Icon))
