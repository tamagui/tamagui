import React from "react";
import { Text, View } from 'react-native';

export function TimedRender(props) {
  const [start] = React.useState(Date.now());
  const [end, setEnd] = React.useState(0);

  React.useLayoutEffect(() => {
    setEnd(Date.now());
  }, []);

  return (
    <View style={{ maxWidth: '100%' }}>
      {!!end && <Text>Took {end - start}ms</Text>}
      <View style={{ flexDirection: 'column' }}>{props.children}</View>
    </View>);

}