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
      <Path d="M11 21c0-2.5 2-2.5 2-5" stroke={color} />
      <Path d="M16 21c0-2.5 2-2.5 2-5" stroke={color} />
      <Path
        d="m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8"
        stroke={color}
      />
      <Path
        d="M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z"
        stroke={color}
      />
      <Path d="M6 21c0-2.5 2-2.5 2-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlarmSmoke'

export const AlarmSmoke = memo<IconProps>(themed(Icon))
