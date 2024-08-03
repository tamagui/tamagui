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

      <Path d="M11 12H3" stroke={color} />
      <Path d="M16 6H3" stroke={color} />
      <Path d="M16 18H3" stroke={color} />
      <Path d="M18 9v6" stroke={color} />
      <Path d="M21 12h-6" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ListPlus';

export const ListPlus = React.memo<IconProps>(themed(Icon));