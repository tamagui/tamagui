import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import * as React from 'react'
import { StyleSheet, Text as RNText, View as RNView } from 'react-native'
import {
  Button,
  getVariableValue,
  styled,
  TamaguiProvider,
  usePropsAndStyle,
  View,
} from 'tamagui'
import { createNativeRuntimeBenchApp } from '../shared/native-runtime-bench'
import config from './tamagui.config'

export const App = createNativeRuntimeBenchApp({
  React,
  Linking,
  useURL,
  RNView,
  RNText,
  flattenStyle: StyleSheet.flatten,
  TamaguiProvider,
  styled,
  View,
  Button,
  getVariableValue,
  usePropsAndStyle,
  config,
  version: 'v2',
  framework: 'tamagui-v2-runtime',
  buildId: process.env.EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID,
})
