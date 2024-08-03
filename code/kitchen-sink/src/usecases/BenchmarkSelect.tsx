import React from "react";import { SelectDemo } from '@tamagui/demos';

import { StyleSheet, View } from 'react-native';
import { Button, ListItem, Text, XStack, YStack } from 'tamagui';

import { TimedRender } from '../components/TimedRender';

export const BenchmarkSelect = () => {
  const [x, setX] = React.useState(0);

  return (
    <>
      <Button onPress={() => setX(Math.random())}>Go</Button>
      <YStack ov="hidden">
        <XStack>
          <BenchSelect key={x} />
        </XStack>
      </YStack>
    </>);

};

const BenchSelect = () => {
  return (
    <TimedRender>
      <YStack w="100%">
        {new Array(100).fill(0).map((_, i) =>
        <ListItem key={i} title="Test" subTitle="test2"></ListItem>
        )}
      </YStack>
    </TimedRender>);

};