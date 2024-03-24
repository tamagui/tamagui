import { Button, Text, View } from "tamagui";
export default function Home() {
  return (
    <View padding="$19" gap="$8">
      <Text>Home</Text>
      <Button>
        <Button.Text>Click</Button.Text>
      </Button>
      <Button theme="red">
        <Button.Text>Click</Button.Text>
      </Button>
      <Button theme="blue">
        <Button.Text>Click</Button.Text>
      </Button>
    </View>
  );
}
