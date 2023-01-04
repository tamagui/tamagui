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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M45.1,196a8.1,8.1,0,0,0,10,5.9,273,273,0,0,1,145.7,0,8.1,8.1,0,0,0,10-5.9L236.3,87.7a8,8,0,0,0-11-9.2L174.7,101a8.1,8.1,0,0,1-10.3-3.4L135,44.6a8,8,0,0,0-14,0l-29.4,53A8.1,8.1,0,0,1,81.3,101L30.7,78.5a8,8,0,0,0-11,9.2Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M96,161.7a297.7,297.7,0,0,1,64,0"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'CrownRegular'

export const CrownRegular = memo<IconProps>(themed(Icon))
