import { Image as ImageIcon, X } from '../../icons'
import { useId, useState } from 'react'
import { Button, Image, Label, View } from 'tamagui'
import { tone } from '../../tone'

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
  const filled = images.length > 0

  const remove = (index: number) => {
    const gone = images[index]
    if (gone?.startsWith('blob:')) {
      URL.revokeObjectURL(gone)
    }
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    // @ts-ignore reason: getRootProps() which is web specific return some react-native incompatible props, but it's fine
    <View
      flexDirection="column"
      {...getRootProps()}
      borderStyle="dashed"
      maxW={600}
      width="100%"
      minH={350}
      justify="center"
      items="center"
      borderWidth={isDragActive ? 2 : 1}
      borderColor={`${isDragActive ? 'color-10' : 'color-8'}`}
      bg={isDragActive ? tone.fill : 'transparent'}
      gap="4"
      rounded="4"
      p="6"
    >
      {/* need an empty input div just have image drop feature in the web */}
      {/* @ts-ignore */}
      <View id={id} render="input" width={0} height={0} {...getInputProps()} />

      {!filled && (
        <View
          width={48}
          height={48}
          rounded="full"
          bg={tone.fill}
          items="center"
          justify="center"
        >
          <ImageIcon size={20} color="color-9" />
        </View>
      )}

      <Button size="sm" onPress={open}>
        {filled ? 'Add more' : 'Pick images'}
      </Button>

      {!filled && (
        <Label
          display="flex native:none"
          color={tone.muted}
          whiteSpace="nowrap"
          size="3"
          htmlFor={id}
        >
          Drag images into this area
        </Label>
      )}

      {filled && (
        <View flexDirection="row" flexWrap="wrap" gap="4" justify="center" width="100%">
          {images.map((image, i) => (
            <View
              key={`${image}-${i}`}
              width={96}
              height={96}
              position="relative"
              rounded="4"
              overflow="hidden"
              borderWidth={1}
              borderColor={tone.border}
            >
              <Image width={96} height={96} src={image} alt="" objectFit="cover" />
              <Button
                onPress={() => remove(i)}
                aria-label={`Remove image ${i + 1}`}
                r={4}
                t={4}
                size="xs"
                circular
                position="absolute"
                bg={tone.surface}
                borderWidth={1}
                borderColor={tone.border}
              >
                <X size={12} />
              </Button>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
