import { X } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import { Button, Image, Label, ScrollView, View, XStack } from 'tamagui'

import { useFilePicker } from './hooks/useFilePicker'
import { MediaTypeOptions } from './types'

/** ------ EXAMPLE ------ */
export function ImagePicker() {
  const id = useId()
  const [images, setImages] = useState<string[]>([])
  const { open, getInputProps, getRootProps, dragStatus } = useFilePicker({
    typeOfPicker: 'image',
    mediaTypes: [MediaTypeOptions.Images],
    multiple: true,

    onPick: ({ webFiles, nativeFiles }) => {
      if (webFiles?.length) {
        const pickedImages = webFiles?.map((file) => URL.createObjectURL(file))
        setImages((images) => [...images, ...pickedImages])
      } else if (nativeFiles?.length) {
        setImages((images) => [...images, ...nativeFiles.map((file) => file.uri)])
      }
    },
  })

  const { isDragActive } = dragStatus

  return (
    // @ts-ignore reason: getRootProps() which is web specific return some react-native incompatible props, but it's fine
    <View
      flexDirection="column"
      {...getRootProps()}
      bs="dashed"
      maxWidth={600}
      width="100%"
      height={350}
      justifyContent="center"
      alignItems="center"
      borderWidth={isDragActive ? 2 : 1}
      borderColor={isDragActive ? '$gray11' : '$gray9'}
      gap="$2"
      borderRadius="$true"
    >
      {/* need an empty input div just have image drop feature in the web */}
      {/* @ts-ignore */}
      <View id={id} tag="input" width={0} height={0} {...getInputProps()} />
      <View>
        <Button size="$3" onPress={open}>
          Pick Images
        </Button>

        <View width="100%" alignItems="center" justifyContent="center">
          <Label
            display={images.length ? 'none' : 'flex'}
            $platform-native={{
              display: 'none',
            }}
            size="$3"
            htmlFor={id}
            color="$color9"
            t="$1"
            pos="absolute"
            whiteSpace="nowrap"
          >
            Drag images into this area
          </Label>
        </View>
      </View>

      <ScrollView
        display={images.length ? 'flex' : 'none'}
        flexDirection="row"
        borderRightWidth={1}
        borderLeftWidth={1}
        borderColor="$gray4Light"
        width="100%"
        themeInverse
        paddingBottom="$0"
        horizontal
        overflow="scroll"
        flexWrap="nowrap"
        maxHeight={110}
      >
        <XStack gap="$4" flexWrap="nowrap" maxHeight={110} px="$4" pt={10}>
          {images?.map((image, i) => (
            <View flexDirection="column" key={image} maxHeight={110}>
              <Image
                borderRadius={10}
                key={image}
                width={100}
                height={100}
                source={{ uri: image }}
              />
              <Button
                onPress={() => {
                  setImages(images.filter((_, index) => index !== i))
                }}
                right={0}
                y={-6}
                x={6}
                size="$1"
                circular
                position="absolute"
              >
                <X size={12} />
              </Button>
            </View>
          ))}
        </XStack>
      </ScrollView>
    </View>
  )
}

ImagePicker.fileName = 'ImagePicker'
