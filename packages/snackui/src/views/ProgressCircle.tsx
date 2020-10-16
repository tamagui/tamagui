import React, { Component } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

export function ProgressCircle({
  percent,
  color,
  bgColor = 'transparent',
  innerColor = '#fff',
  radius,
  borderWidth = 2,
  textStyle = null,
  children,
  style,
}: {
  color: string
  bgColor?: string
  innerColor?: string
  radius: number
  percent: number
  borderWidth?: number
  textStyle?: any
  children?: any
  style?: ViewStyle
}) {
  let leftTransformerDegree = '0deg'
  let rightTransformerDegree = '0deg'
  if (percent >= 50) {
    rightTransformerDegree = '180deg'
    leftTransformerDegree = (percent - 50) * 3.6 + 'deg'
  } else {
    rightTransformerDegree = percent * 3.6 + 'deg'
    leftTransformerDegree = '0deg'
  }

  const state = {
    borderWidth: borderWidth < 1 || !borderWidth ? 1 : borderWidth,
    leftTransformerDegree: leftTransformerDegree,
    rightTransformerDegree: rightTransformerDegree,
    textStyle: textStyle ? textStyle : null,
    rotate: (100 - percent) * (radius / 10),
  }

  return (
    <View
      style={[
        styles.circle,
        {
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: bgColor,
          transform: [{ rotate: `${state.rotate}deg` }],
        },
        style,
      ]}
    >
      <View
        style={[
          styles.leftWrap,
          {
            width: radius,
            height: radius * 2,
            left: 0,
          },
        ]}
      >
        <View
          style={[
            styles.loader,
            {
              left: radius,
              width: radius,
              height: radius * 2,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              backgroundColor: color,
              transform: [
                { translateX: -radius / 2 },
                { rotate: state.leftTransformerDegree },
                { translateX: radius / 2 },
              ],
            },
          ]}
        ></View>
      </View>
      <View
        style={[
          styles.leftWrap,
          {
            left: radius,
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <View
          style={[
            styles.loader,
            {
              left: -radius,
              width: radius,
              height: radius * 2,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              // backgroundColor: color,
              transform: [
                { translateX: radius / 2 },
                { rotate: state.rightTransformerDegree },
                { translateX: -radius / 2 },
              ],
            },
          ]}
        ></View>
      </View>
      <View
        style={[
          styles.innerCircle,
          {
            width: (radius - state.borderWidth) * 2,
            height: (radius - state.borderWidth) * 2,
            borderRadius: radius - state.borderWidth,
            backgroundColor: innerColor,
            transform: [{ rotate: `-${state.rotate}deg` }],
          },
        ]}
      >
        {children ? children : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftWrap: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  },
  rightWrap: {
    position: 'absolute',
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 1000,
  },
  innerCircle: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    color: '#888',
  },
})
