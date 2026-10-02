import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ExternalLink: (props: IconProps) => JSX.Element = themed(
  memo(function ExternalLink(props: IconProps) {
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
        <Path d="M15 3h6v6" stroke={color} />
        <Path d="M10 14 21 3" stroke={color} />
        <Path
          d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
          stroke={color}
        />
      </Svg>
    )
  })
)
