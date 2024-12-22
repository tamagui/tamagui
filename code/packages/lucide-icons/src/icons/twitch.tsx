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
      <Path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Twitch'

export const Twitch = memo<IconProps>(themed(Icon))
