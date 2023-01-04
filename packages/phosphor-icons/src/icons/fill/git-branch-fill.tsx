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
      <_Path d="M224,68a36,36,0,1,0-44,35.1v.9a16,16,0,0,1-16,16H92a32.2,32.2,0,0,0-16,4.3V103.1a36,36,0,1,0-16,0v49.8a36,36,0,1,0,16,0V152a16,16,0,0,1,16-16h72a32.1,32.1,0,0,0,32-32v-.9A36.1,36.1,0,0,0,224,68ZM48,68A20,20,0,1,1,68,88,20.1,20.1,0,0,1,48,68ZM88,188a20,20,0,1,1-20-20A20.1,20.1,0,0,1,88,188Z" />
    </_Svg>
  )
}

Icon.displayName = 'GitBranchFill'

export const GitBranchFill = memo<IconProps>(themed(Icon))
