import { File, Upload, X } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import { Button, Label, Text, View, XStack } from 'tamagui'

import { useFilePicker } from './hooks/useFilePicker'
import { MediaTypeOptions } from './types'

/** ------ EXAMPLE ------ */
export function UploadFile() {
  const id = useId()
  const [file, setFile] = useState<File>()
  const { open, getInputProps, getRootProps, dragStatus } = useFilePicker({
    typeOfPicker: 'file',
    mediaTypes: [MediaTypeOptions.All],
    multiple: false, // Added as per requirement
    onPick: ({ webFiles, nativeFiles }) => {
      if (webFiles?.length) {
        setFile(webFiles[0])
      } else if (nativeFiles?.length) {
        setFile(nativeFiles[0] as any)
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
      width={400}
      maxWidth="100%"
      height={250}
      justifyContent="center"
      alignItems="center"
      borderWidth={isDragActive ? 2 : 1}
      borderColor={isDragActive ? '$gray11' : '$gray9'}
      gap="$6"
      borderRadius="$3"
      overflow="hidden"
    >
      <View gap="$3" p="$4" flex={1} ai="center" justifyContent="center">
        <Button onPress={open} size="$3">
          <Button.Icon>
            <Upload y={-1} />
          </Button.Icon>
          <Button.Text size="$2">Choose File here</Button.Text>
        </Button>
        {!file && (
          <View
            width="100%"
            alignItems="center"
            justifyContent="center"
            $platform-native={{
              display: 'none',
            }}
          >
            <Label
              t="$1"
              pos="absolute"
              size="$3"
              htmlFor={id}
              color="$color9"
              whiteSpace="nowrap"
            >
              Drag a file into this area
            </Label>
          </View>
        )}
        {/* @ts-ignore */}
        <View id={id} tag="input" width={0} height={0} {...getInputProps()} />
      </View>

      {file && (
        <XStack
          width="100%"
          gap="$4"
          p="$4"
          borderTopWidth={1}
          borderTopColor="$borderColor"
        >
          <View flex={1}>
            <View flexDirection="row" theme="alt1" gap="$2" ai={'center'} pos="absolute">
              <View flexShrink={0}>
                <File color="$color" size={'$1'} />
              </View>
              <View gap="$1" flex={1}>
                <Text numberOfLines={1} fontSize={'$3'}>
                  {file.name}
                </Text>
                <Text numberOfLines={1} fontSize={'$3'} fontWeight="bold">
                  {formatFileSize(file.size)}
                </Text>
              </View>
            </View>
          </View>
          <Button onPress={() => setFile(undefined)} themeInverse circular size="$2">
            <Button.Icon>
              <X />
            </Button.Icon>
          </Button>
        </XStack>
      )}
    </View>
  )
}

UploadFile.fileName = 'UploadFile'

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}
