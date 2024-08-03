import * as React from "react";import type { IconProps } from '@tamagui/helpers-icon';
import { themed } from '@tamagui/helpers-icon';
import PropTypes from 'prop-types';

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
  Use,
  Circle as _Circle,
  Text as _Text } from
'react-native-svg';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
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
      {...otherProps}>

      <Path d="M18 21a6 6 0 0 0-12 0" stroke={color} />
      <_Circle cx="12" cy="11" r="4" stroke={color} />
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
    </Svg>);

};

Icon.displayName = 'UserSquare2';

export const UserSquare2 = React.memo<IconProps>(themed(Icon));