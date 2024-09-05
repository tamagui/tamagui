import React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

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

      <Path d="M8 3 4 7l4 4" stroke={color} />
      <Path d="M4 7h16" stroke={color} />
      <Path d="m16 21 4-4-4-4" stroke={color} />
      <Path d="M20 17H4" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ArrowLeftRight';

export const ArrowLeftRight = React.memo<IconProps>(themed(Icon));