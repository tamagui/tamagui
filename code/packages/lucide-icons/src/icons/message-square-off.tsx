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

      <Path d="M21 15V5a2 2 0 0 0-2-2H9" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M3.6 3.6c-.4.3-.6.8-.6 1.4v16l4-4h10" stroke={color} />
    </Svg>);

};

Icon.displayName = 'MessageSquareOff';

export const MessageSquareOff = React.memo<IconProps>(themed(Icon));