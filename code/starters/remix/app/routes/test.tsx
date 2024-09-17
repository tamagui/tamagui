import type { MetaFunction } from "@remix-run/node";
import { Text } from "@tamagui/core";

const meta: MetaFunction = () => {
  return [{ title: "Test" }];
};

export default function Test() {
  return <Text>Test</Text>;
}
