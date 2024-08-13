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

      <_Circle cx="6" cy="6" r="3" stroke={color} />
      <Path d="M8.12 8.12 12 12" stroke={color} />
      <Path d="M20 4 8.12 15.88" stroke={color} />
      <_Circle cx="6" cy="18" r="3" stroke={color} />
      <Path d="M14.8 14.8 20 20" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Scissors';

export const Scissors = React.memo<IconProps>(themed(Icon));