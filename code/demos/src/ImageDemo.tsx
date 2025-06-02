import { Image, ImageProps } from "@tamagui/image";

export function ImageDemo() {
  return (
    <>
      <Image
        src="https://picsum.photos/200/300"
        width={200}
        height={300}
        onLoad={() => {
          console.log("loaded");
        }}
        onLayout={(e) => {
          console.log("layout", e.nativeEvent);
        }}
      />
    </>
  );
}
