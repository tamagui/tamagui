import React from "react";import type { IconProps } from '@tamagui/helpers-icon';
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

      <_Circle cx="12" cy="8" r="5" stroke={color} />
      <Path d="M20 21a8 8 0 1 0-16 0" stroke={color} />
    </Svg>);

};

Icon.displayName = 'User2';

export const User2 = React.memo<IconProps>(themed(Icon));