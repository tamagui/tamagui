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

      <Path d="M7 10c-2.8 0-5-2.2-5-5h5" stroke={color} />
      <Path d="M7 4v8h7a8 8 0 0 0 8-8Z" stroke={color} />
      <Path d="M9 12v5" stroke={color} />
      <Path d="M15 12v5" stroke={color} />
      <Path d="M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1H5Z" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Anvil';

export const Anvil = React.memo<IconProps>(themed(Icon));