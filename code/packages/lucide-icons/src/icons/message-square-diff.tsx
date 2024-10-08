import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path
        d="m5 19-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"
        stroke={color}
      />
      <Path d="M9 10h6" stroke={color} />
      <Path d="M12 7v6" stroke={color} />
      <Path d="M9 17h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareDiff'

export const MessageSquareDiff = memo<IconProps>(themed(Icon))
