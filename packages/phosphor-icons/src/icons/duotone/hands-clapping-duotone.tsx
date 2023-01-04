import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M77,93.5,69,79.7a17.6,17.6,0,0,0-9.1-7.8h0l-2.4-4.1a18,18,0,1,1,31.2-18L99,67.7h0A18,18,0,0,0,77,93.5"
        opacity="0.2"
      />
      <_Path
        d="M156.2,94.7a18,18,0,0,0-22,25.8l-26-45A17.9,17.9,0,0,0,99,67.7h0l-2.3-4a18,18,0,1,1,31.2-18l28.3,49Z"
        opacity="0.2"
      />
      <_Path
        d="M153.9,90.7a18,18,0,1,1,31.2-18l17,29.4A72.1,72.1,0,0,1,188,191.5h0a71.5,71.5,0,0,0-5.7-59.5l-17-29.5a18.2,18.2,0,0,0-9.1-7.8h0Z"
        opacity="0.2"
      />
      <_Path
        d="M51.8,121.9a18,18,0,1,0-31.2,18l37,64.1a72,72,0,0,0,124.7-72l-17-29.5a18,18,0,0,0-31.1,18"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M107,145.5,69,79.7a18,18,0,1,0-31.2,18l38,65.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M150.2,148.3l-42-72.8A18,18,0,1,0,77,93.5"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M99,67.7,88.7,49.8a18,18,0,1,0-31.2,18l2.4,4.1"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M188,191.5a72.1,72.1,0,0,0,14.1-89.4l-17-29.4a18,18,0,1,0-31.2,18"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M156.2,94.7l-28.3-49a18,18,0,1,0-31.2,18"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="176.8"
        y1="11.3"
        x2="172.7"
        y2="26.7"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="207.1"
        y1="25.4"
        x2="197.9"
        y2="38.5"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="230.6"
        y1="48.9"
        x2="217.5"
        y2="58.1"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'HandsClappingDuotone'

export const HandsClappingDuotone = memo<IconProps>(themed(Icon))
