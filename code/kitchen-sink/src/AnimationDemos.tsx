import React from "react";
import { AnimatePresence, Button, Square, styled } from 'tamagui';

function Demo1() {
  return (
    <Square
      size={200}
      animation="bouncy"
      bg="$red10"
      pressStyle={{
        bg: 'green',
        scale: 1.2
      }} />);


}

//

function Demo2() {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Button onPress={() => setShow(!show)}>Toggle</Button>
      {show &&
      <Square
        size={200}
        animation="bouncy"
        bg="$red10"
        enterStyle={{
          opacity: 0
        }}
        exitStyle={{
          opacity: 0
        }} />}


    </>);

}

//

import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons';
import { Image, XStack, YStack } from 'tamagui';

const GalleryItem = styled(YStack, {
  zIndex: 1,
  x: 0,
  opacity: 1,
  fullscreen: true,

  variants: ({
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going > 0 ? 1000 : -1000,
          opacity: 0
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 1000 : -1000,
          opacity: 0
        }
      })
    }
  } as const)
});

const photos = [
'https://picsum.photos/500/300',
'https://picsum.photos/501/300',
'https://picsum.photos/502/300'];


const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};

export function Demo3() {
  const [[page, going], setPage] = React.useState([0, 0]);

  const imageIndex = wrap(0, photos.length, page);
  const paginate = (going: number) => {
    setPage([page + going, going]);
  };

  return (
    <XStack
      overflow="hidden"
      backgroundColor="#000"
      position="relative"
      height={300}
      width="100%"
      alignItems="center">

      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} animation="lazy" going={going}>
          <Image source={{ uri: photos[imageIndex], width: 500, height: 300 }} />
        </GalleryItem>
      </AnimatePresence>

      <Button
        accessibilityLabel="Carousel left"
        icon={ArrowLeft}
        size="$5"
        position="absolute"
        left="$4"
        circular
        elevate
        onPress={() => paginate(-1)}
        zi={100} />

      <Button
        accessibilityLabel="Carousel right"
        icon={ArrowRight}
        size="$5"
        position="absolute"
        right="$4"
        circular
        elevate
        onPress={() => paginate(1)}
        zi={100} />

    </XStack>);

}