import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Rect } from 'react-native-svg'
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
      <Rect width="20" height="12" x="2" y="6" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RectangleHorizontal'

export const RectangleHorizontal = memo<IconProps>(themed(Icon))
