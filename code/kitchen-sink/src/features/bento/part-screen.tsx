import React from "react";import { Components } from '@tamagui/bento';

import { createParam } from 'solito';
import { ScrollView, YStack } from 'tamagui';

const { useParam } = createParam<{id: string;}>();
export function BentoPartScreen({ navigation }) {
  const [id] = useParam('id');
  const name = id!.
  split('-').
  map((segment) => {
    return segment[0].toUpperCase() + segment.slice(1);
  }).
  join('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name
    });
  }, [name, navigation]);

  return (
    <ScrollView>
      <YStack jc="center" ai="center" bg="$background" minWidth="100%" px="$2">
        {Object.values(Components[name] ?? []).map((Component, index) => {
          const ComponentElement = (Component as React.ElementType);
          // add navigation prop here just for components that use it. eg: TabBar
          return <ComponentElement key={index} navigation={navigation} />;
        })}
      </YStack>
    </ScrollView>);

}