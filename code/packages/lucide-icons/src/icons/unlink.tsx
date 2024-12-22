import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
        d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
        stroke={color}
      />
      <Path
        d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"
        stroke={color}
      />
      <Line x1="8" x2="8" y1="2" y2="5" stroke={color} />
      <Line x1="2" x2="5" y1="8" y2="8" stroke={color} />
      <Line x1="16" x2="16" y1="19" y2="22" stroke={color} />
      <Line x1="19" x2="22" y1="16" y2="16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Unlink'

export const Unlink = memo<IconProps>(themed(Icon))
