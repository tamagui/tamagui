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
      <_Path d="M191.3,47l14.1-13.1a8.2,8.2,0,0,0,.4-11.4,8,8,0,0,0-11.3-.4L179.1,36.5a87.7,87.7,0,0,0-102.4,0L61.4,22.1A8,8,0,0,0,50.5,33.9L64.6,47a87.4,87.4,0,0,0-24.7,61v40a88,88,0,0,0,176,0V108A87.7,87.7,0,0,0,191.3,47ZM127.9,36a72.1,72.1,0,0,1,72,72v12H55.9V108A72.1,72.1,0,0,1,127.9,36Zm16,56a12,12,0,1,1,12,12A12,12,0,0,1,143.9,92Zm-56,0a12,12,0,1,1,12,12A12,12,0,0,1,87.9,92Z" />
    </_Svg>
  )
}

Icon.displayName = 'BugDroidFill'

export const BugDroidFill = memo<IconProps>(themed(Icon))
