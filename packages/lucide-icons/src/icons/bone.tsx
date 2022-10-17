import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Symbol,
  Text,
  Use,
  Circle as _Circle,
} from 'react-native-svg'

import { IconProps } from '../IconProps'
import { themed } from '../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`${color}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path
        d="M18.6 9.82c-.52-.21-1.15-.25-1.54.15l-7.07 7.06c-.39.39-.36 1.03-.15 1.54.12.3.16.6.16.93a2.5 2.5 0 0 1-5 0c0-.26-.24-.5-.5-.5a2.5 2.5 0 1 1 .96-4.82c.5.21 1.14.25 1.53-.15l7.07-7.06c.39-.39.36-1.03.15-1.54-.12-.3-.21-.6-.21-.93a2.5 2.5 0 0 1 5 0c.01.26.24.49.5.5a2.5 2.5 0 1 1-.9 4.82Z"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'Bone'

export const Bone = memo<IconProps>(themed(Icon))
