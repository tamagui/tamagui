import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import * as React from 'react'
import { Text as RNText, View as RNView } from 'react-native'
import {
  Button,
  getVariableValue,
  GroupContext,
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
  TamaguiProvider,
  GroupContext,
  View,
  Button,
  getVariableValue,
  usePropsAndStyle,
  config,
  version: 'v3',
  framework: 'tamagui-v3-runtime',
  buildId: process.env.EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID,
})
