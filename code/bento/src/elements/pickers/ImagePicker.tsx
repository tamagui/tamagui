import { X } from '../../icons'
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
      borderStyle="dashed"
      maxW={600}
      width="100%"
      height={350}
      justify="center"
      items="center"
      borderWidth={isDragActive ? 2 : 1}
      borderColor={`${isDragActive ? 'color-10' : 'color-8'}`}
      gap="2"
      rounded="4"
    >
      {/* need an empty input div just have image drop feature in the web */}
      {/* @ts-ignore */}
      <View id={id} render="input" width={0} height={0} {...getInputProps()} />
      <View>
        <Button size="sm" onPress={open}>
          Pick Images
        </Button>

        <View position="relative" width="100%" items="center" justify="center">
          <Label
            display={`${images.length ? 'none' : 'flex'} native:none`}
            color="color-8"
            t="1"
            position="absolute"
            whiteSpace="nowrap"
            size="3"
            htmlFor={id}
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
        borderColor="color-4"
        width="100%"
        pb="0"
        overflow="scroll"
        flexWrap="nowrap"
        maxH={110}
        theme="accent"
        horizontal
      >
        <XStack gap="4" flexWrap="nowrap" maxH={110} px="4" pt={10}>
          {images?.map((image, i) => (
            <View flexDirection="column" key={image} maxH={110}>
              <Image rounded={10} key={image} width={100} height={100} src={image} />
              <Button
                onPress={() => {
                  setImages(images.filter((_, index) => index !== i))
                }}
                r={0}
                y={-6}
                x={6}
                size="xs"
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
