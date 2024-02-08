import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  Button,
  Paragraph,
  Progress,
  SizeTokens,
  Slider,
  XStack,
  YStack,
} from "tamagui";

export function ProgressDemo() {
  const [size, setSize] = useState(4);
  const [progress, setProgress] = useState(0);
  const sizeProp = `$${size}` as SizeTokens;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <YStack height={60} gap="$5">
        <Paragraph height={30} opacity={0.5}>
          Size: {size}
        </Paragraph>
        <Progress max={100} size={sizeProp} value={progress}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
        {Platform.OS === "ios" && (
          <Progress
            w={200}
            h={20}
            max={100}
            native="ios"
            size={sizeProp}
            value={progress}
          />
        )}
      </YStack>

      <XStack
        alignItems="center"
        space
        position="absolute"
        bottom="$-10"
        left="$4"
        $xxs={{ display: "none" }}
      >
        <Slider
          size="$2"
          width={130}
          defaultValue={[4]}
          min={2}
          max={6}
          step={1}
          onValueChange={([val]) => {
            setSize(val);
          }}
        >
          <Slider.Track borderWidth={1} borderColor="$color5">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Button
          size="$2"
          onPress={() => setProgress((prev) => (prev + 20) % 100)}
        >
          Load
        </Button>
      </XStack>
    </>
  );
}
