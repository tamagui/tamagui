import * as React from "react";
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

      <Path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2" stroke={color} />
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <_Circle cx="6" cy="14" r="3" stroke={color} />
      <Path d="M6 10v1" stroke={color} />
      <Path d="M6 17v1" stroke={color} />
      <Path d="M10 14H9" stroke={color} />
      <Path d="M3 14H2" stroke={color} />
      <Path d="m9 11-.88.88" stroke={color} />
      <Path d="M3.88 16.12 3 17" stroke={color} />
      <Path d="m9 17-.88-.88" stroke={color} />
      <Path d="M3.88 11.88 3 11" stroke={color} />
    </Svg>);

};

Icon.displayName = 'FileCog';

export const FileCog = React.memo<IconProps>(themed(Icon));